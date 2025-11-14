import logger from '../utils/logger.js';

/**
 * Recovery Manager - Handles automatic recovery from failures
 */
class RecoveryManager {
  constructor(orchestrator) {
    this.orchestrator = orchestrator;
    this.recoveryStrategies = new Map();
    this.registerDefaultStrategies();
  }

  /**
   * Register default recovery strategies
   */
  registerDefaultStrategies() {
    // Network timeout recovery
    this.registerStrategy('timeout', async (context) => {
      logger.info({ workflowId: context.workflowId }, 'Recovering from timeout');

      // Wait before retry
      await this.sleep(5000);

      // Resume from last checkpoint
      return await this.orchestrator.resumeWorkflow(context.workflowId);
    });

    // API rate limit recovery
    this.registerStrategy('rate_limit', async (context) => {
      logger.info({ workflowId: context.workflowId }, 'Recovering from rate limit');

      // Wait for rate limit reset
      const waitTime = context.retryAfter || 60000;
      await this.sleep(waitTime);

      // Resume workflow
      return await this.orchestrator.resumeWorkflow(context.workflowId);
    });

    // Service unavailable recovery
    this.registerStrategy('service_unavailable', async (context) => {
      logger.info({ workflowId: context.workflowId, service: context.service }, 'Recovering from service unavailable');

      // Exponential backoff
      const attempt = context.attempt || 1;
      const backoff = Math.min(1000 * Math.pow(2, attempt), 30000);

      await this.sleep(backoff);

      // Check if service is back online
      const isAvailable = await this.checkServiceAvailability(context.service);

      if (isAvailable) {
        return await this.orchestrator.resumeWorkflow(context.workflowId);
      } else {
        throw new Error(`Service ${context.service} still unavailable`);
      }
    });

    // Memory overflow recovery
    this.registerStrategy('memory_overflow', async (context) => {
      logger.info({ workflowId: context.workflowId }, 'Recovering from memory overflow');

      // Clear conversation history in Anthropic adapter
      await this.orchestrator.integrations.anthropic.resetConversation();

      // Create checkpoint
      await this.orchestrator.createCheckpoint();

      // Continue workflow
      return { success: true, message: 'Memory cleared and checkpoint created' };
    });

    // Data consistency recovery
    this.registerStrategy('data_inconsistency', async (context) => {
      logger.info({ workflowId: context.workflowId }, 'Recovering from data inconsistency');

      // Load last known good checkpoint
      const checkpoint = await this.orchestrator.stateManager.loadCheckpoint(context.workflowId);

      if (!checkpoint) {
        throw new Error('No valid checkpoint found for recovery');
      }

      // Restore state
      await this.orchestrator.stateManager.saveState(context.workflowId, checkpoint.state);

      return { success: true, message: 'State restored from checkpoint' };
    });
  }

  /**
   * Register a custom recovery strategy
   */
  registerStrategy(errorType, handler) {
    this.recoveryStrategies.set(errorType, handler);
    logger.info({ errorType }, 'Recovery strategy registered');
  }

  /**
   * Attempt recovery from error
   */
  async recover(error, context) {
    try {
      const errorType = this.identifyErrorType(error);
      logger.info({ errorType, workflowId: context.workflowId }, 'Attempting recovery');

      const strategy = this.recoveryStrategies.get(errorType);

      if (!strategy) {
        logger.warn({ errorType }, 'No recovery strategy found');
        return { success: false, message: 'No recovery strategy available' };
      }

      // Store error in memory
      await this.orchestrator.memoryManager.storeError({
        error: error.message,
        recovery: `Attempting ${errorType} recovery`,
        context
      });

      // Execute recovery strategy
      const result = await strategy({ ...context, error });

      // Store successful recovery
      await this.orchestrator.memoryManager.store({
        content: `Successfully recovered from ${errorType} error`,
        metadata: {
          type: 'recovery_success',
          errorType,
          workflowId: context.workflowId
        },
        importance: 'high'
      });

      logger.info({ errorType, workflowId: context.workflowId }, 'Recovery successful');
      return { success: true, result };
    } catch (recoveryError) {
      logger.error({
        error: recoveryError,
        originalError: error,
        workflowId: context.workflowId
      }, 'Recovery failed');

      // Notify via Discord
      await this.orchestrator.integrations.discord.notifyWorkflowError({
        workflowId: context.workflowId,
        error: error.message,
        recovery: 'Automatic recovery failed - manual intervention required'
      });

      return { success: false, error: recoveryError.message };
    }
  }

  /**
   * Identify error type for recovery
   */
  identifyErrorType(error) {
    const errorMessage = error.message.toLowerCase();

    if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
      return 'timeout';
    }

    if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      return 'rate_limit';
    }

    if (errorMessage.includes('503') || errorMessage.includes('unavailable')) {
      return 'service_unavailable';
    }

    if (errorMessage.includes('memory') || errorMessage.includes('context')) {
      return 'memory_overflow';
    }

    if (errorMessage.includes('inconsist') || errorMessage.includes('corrupt')) {
      return 'data_inconsistency';
    }

    return 'unknown';
  }

  /**
   * Check if a service is available
   */
  async checkServiceAvailability(service) {
    try {
      // Simple health check - extend as needed
      switch (service) {
        case 'anthropic':
          // Check if API is responding
          return true; // Implement actual check

        case 'discord':
          return this.orchestrator.integrations.discord.isReady;

        case 'redis':
          await this.orchestrator.stateManager.redis.ping();
          return true;

        default:
          return false;
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * Scan for failed workflows and attempt recovery
   */
  async scanAndRecover() {
    logger.info('Scanning for failed workflows...');

    try {
      // Get all workflow keys from Redis
      const workflowKeys = await this.orchestrator.stateManager.redis.keys('workflow:*:state');

      for (const key of workflowKeys) {
        const stateJson = await this.orchestrator.stateManager.redis.get(key);
        if (!stateJson) continue;

        const state = JSON.parse(stateJson);

        // Check if workflow is stuck or failed
        if (state.status === 'running') {
          const lastUpdate = new Date(state.lastUpdated);
          const timeSinceUpdate = Date.now() - lastUpdate.getTime();

          // If no update in 30 minutes, attempt recovery
          if (timeSinceUpdate > 30 * 60 * 1000) {
            logger.warn({ workflowId: state.id }, 'Found stuck workflow, attempting recovery');

            await this.recover(new Error('Workflow stuck'), {
              workflowId: state.id,
              reason: 'stuck'
            });
          }
        }
      }
    } catch (error) {
      logger.error({ error }, 'Failed to scan for failed workflows');
    }
  }

  /**
   * Start automatic recovery monitoring
   */
  startMonitoring(interval = 5 * 60 * 1000) {
    this.monitoringInterval = setInterval(() => {
      this.scanAndRecover();
    }, interval);

    logger.info({ interval }, 'Recovery monitoring started');
  }

  /**
   * Stop automatic recovery monitoring
   */
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      logger.info('Recovery monitoring stopped');
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default RecoveryManager;
