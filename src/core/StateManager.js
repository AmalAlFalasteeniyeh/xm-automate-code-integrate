import Redis from 'ioredis';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';
import logger from '../utils/logger.js';

/**
 * State Manager - Handles workflow state persistence
 *
 * Features:
 * - Checkpoint/resume capabilities
 * - State snapshots in Redis for fast access
 * - File system backup for durability
 * - Automatic recovery on failure
 */
class StateManager {
  constructor(config) {
    this.config = config;
    this.redis = null;
    this.stateDir = config.stateDir || '/app/data/state';
    this.checkpointInterval = config.checkpointInterval || 5 * 60 * 1000; // 5 minutes
    this.checkpointTimer = null;
  }

  async initialize() {
    try {
      this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3
      });

      this.redis.on('error', (error) => {
        logger.error({ error }, 'Redis connection error');
      });

      this.redis.on('connect', () => {
        logger.info('Redis connected');
      });

      // Ensure state directory exists
      await mkdir(this.stateDir, { recursive: true });

      logger.info('State manager initialized');
    } catch (error) {
      logger.error({ error }, 'Failed to initialize state manager');
      throw error;
    }
  }

  /**
   * Save workflow state
   */
  async saveState(workflowId, state) {
    try {
      const stateKey = `workflow:${workflowId}:state`;
      const historyKey = `workflow:${workflowId}:history`;

      const stateData = {
        ...state,
        lastUpdated: new Date().toISOString(),
        version: (state.version || 0) + 1
      };

      // Save to Redis
      await this.redis.set(stateKey, JSON.stringify(stateData));

      // Add to history
      await this.redis.lpush(historyKey, JSON.stringify({
        timestamp: stateData.lastUpdated,
        version: stateData.version,
        status: state.status
      }));

      // Trim history to last 100 entries
      await this.redis.ltrim(historyKey, 0, 99);

      logger.debug({ workflowId, version: stateData.version }, 'State saved');
      return stateData;
    } catch (error) {
      logger.error({ error, workflowId }, 'Failed to save state');
      throw error;
    }
  }

  /**
   * Load workflow state
   */
  async loadState(workflowId) {
    try {
      const stateKey = `workflow:${workflowId}:state`;
      const stateJson = await this.redis.get(stateKey);

      if (!stateJson) {
        logger.warn({ workflowId }, 'No state found');
        return null;
      }

      const state = JSON.parse(stateJson);
      logger.debug({ workflowId, version: state.version }, 'State loaded');
      return state;
    } catch (error) {
      logger.error({ error, workflowId }, 'Failed to load state');
      throw error;
    }
  }

  /**
   * Create checkpoint for recovery
   */
  async createCheckpoint(workflowId, checkpointData) {
    try {
      const timestamp = Date.now();
      const checkpointId = `${workflowId}-${timestamp}`;

      const checkpoint = {
        id: checkpointId,
        workflowId,
        timestamp: new Date().toISOString(),
        ...checkpointData
      };

      // Save to Redis
      const checkpointKey = `workflow:${workflowId}:checkpoint:${timestamp}`;
      await this.redis.set(checkpointKey, JSON.stringify(checkpoint), 'EX', 86400); // 24 hours

      // Save to file system for durability
      const filePath = join(this.stateDir, `${checkpointId}.json`);
      await writeFile(filePath, JSON.stringify(checkpoint, null, 2));

      // Update latest checkpoint pointer
      await this.redis.set(`workflow:${workflowId}:latest_checkpoint`, checkpointId);

      logger.info({ workflowId, checkpointId }, 'Checkpoint created');
      return checkpointId;
    } catch (error) {
      logger.error({ error, workflowId }, 'Failed to create checkpoint');
      throw error;
    }
  }

  /**
   * Load checkpoint for recovery
   */
  async loadCheckpoint(workflowId, checkpointId = null) {
    try {
      // If no checkpoint ID provided, get latest
      if (!checkpointId) {
        checkpointId = await this.redis.get(`workflow:${workflowId}:latest_checkpoint`);
        if (!checkpointId) {
          logger.warn({ workflowId }, 'No checkpoint found');
          return null;
        }
      }

      // Try Redis first
      const timestamp = checkpointId.split('-').pop();
      const checkpointKey = `workflow:${workflowId}:checkpoint:${timestamp}`;
      let checkpointJson = await this.redis.get(checkpointKey);

      // Fallback to file system
      if (!checkpointJson) {
        const filePath = join(this.stateDir, `${checkpointId}.json`);
        checkpointJson = await readFile(filePath, 'utf-8');
      }

      const checkpoint = JSON.parse(checkpointJson);
      logger.info({ workflowId, checkpointId }, 'Checkpoint loaded');
      return checkpoint;
    } catch (error) {
      logger.error({ error, workflowId, checkpointId }, 'Failed to load checkpoint');
      throw error;
    }
  }

  /**
   * Get workflow history
   */
  async getHistory(workflowId, limit = 10) {
    try {
      const historyKey = `workflow:${workflowId}:history`;
      const historyJson = await this.redis.lrange(historyKey, 0, limit - 1);

      const history = historyJson.map(json => JSON.parse(json));
      return history;
    } catch (error) {
      logger.error({ error, workflowId }, 'Failed to get history');
      return [];
    }
  }

  /**
   * Start automatic checkpointing
   */
  startAutoCheckpoint(workflowId, getCheckpointData) {
    if (this.checkpointTimer) {
      clearInterval(this.checkpointTimer);
    }

    this.checkpointTimer = setInterval(async () => {
      try {
        const data = await getCheckpointData();
        await this.createCheckpoint(workflowId, data);
      } catch (error) {
        logger.error({ error, workflowId }, 'Auto checkpoint failed');
      }
    }, this.checkpointInterval);

    logger.info({ workflowId, interval: this.checkpointInterval }, 'Auto checkpoint started');
  }

  /**
   * Stop automatic checkpointing
   */
  stopAutoCheckpoint() {
    if (this.checkpointTimer) {
      clearInterval(this.checkpointTimer);
      this.checkpointTimer = null;
      logger.info('Auto checkpoint stopped');
    }
  }

  /**
   * Cleanup old checkpoints
   */
  async cleanup(workflowId, keepLast = 10) {
    try {
      const pattern = `workflow:${workflowId}:checkpoint:*`;
      const keys = await this.redis.keys(pattern);

      if (keys.length > keepLast) {
        const toDelete = keys.sort().slice(0, -keepLast);
        if (toDelete.length > 0) {
          await this.redis.del(...toDelete);
          logger.info({ workflowId, deleted: toDelete.length }, 'Old checkpoints cleaned up');
        }
      }
    } catch (error) {
      logger.error({ error, workflowId }, 'Failed to cleanup checkpoints');
    }
  }

  async disconnect() {
    this.stopAutoCheckpoint();
    if (this.redis) {
      await this.redis.quit();
    }
  }
}

export default StateManager;
