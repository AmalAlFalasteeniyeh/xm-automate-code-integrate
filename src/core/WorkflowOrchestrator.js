import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger.js';
import MemoryManager from './MemoryManager.js';
import StateManager from './StateManager.js';
import AnthropicAdapter from '../integrations/AnthropicAdapter.js';
import ClickUpAdapter from '../integrations/ClickUpAdapter.js';
import DiscordAdapter from '../integrations/DiscordAdapter.js';
import LinearAdapter from '../integrations/LinearAdapter.js';
import N8NAdapter from '../integrations/N8NAdapter.js';
import CodeGenAdapter from '../integrations/CodeGenAdapter.js';

/**
 * Workflow Orchestrator - The heart of the system
 *
 * Features:
 * - Orchestrates complex multi-tool workflows
 * - Automatic checkpoint and recovery
 * - Persistent memory across sessions
 * - Error handling and retry logic
 * - Progress tracking and notifications
 */
class WorkflowOrchestrator {
  constructor(config = {}) {
    this.config = {
      maxRetries: parseInt(process.env.MAX_RETRIES) || 3,
      retryDelay: parseInt(process.env.RETRY_DELAY_MS) || 1000,
      timeout: parseInt(process.env.TIMEOUT_MS) || 30000,
      checkpointInterval: parseInt(process.env.CHECKPOINT_INTERVAL_MINUTES) * 60 * 1000 || 300000,
      ...config
    };

    this.workflowId = null;
    this.sessionId = null;
    this.status = 'idle';
    this.startTime = null;

    // Core components
    this.memoryManager = null;
    this.stateManager = null;

    // Integration adapters
    this.integrations = {
      anthropic: null,
      clickup: null,
      discord: null,
      linear: null,
      n8n: null,
      codegen: null
    };
  }

  /**
   * Initialize the orchestrator
   */
  async initialize() {
    try {
      this.sessionId = uuidv4();

      // Initialize core components
      this.memoryManager = new MemoryManager(this.config);
      await this.memoryManager.initialize(this.sessionId);

      this.stateManager = new StateManager(this.config);
      await this.stateManager.initialize();

      // Initialize integrations
      this.integrations.anthropic = new AnthropicAdapter(this.config, this.memoryManager);
      this.integrations.clickup = new ClickUpAdapter(this.config);
      this.integrations.linear = new LinearAdapter(this.config);
      this.integrations.n8n = new N8NAdapter(this.config);
      this.integrations.codegen = new CodeGenAdapter(this.config);

      // Discord needs async initialization
      this.integrations.discord = new DiscordAdapter(this.config);
      await this.integrations.discord.initialize();

      logger.info({ sessionId: this.sessionId }, 'Workflow orchestrator initialized');
    } catch (error) {
      logger.error({ error }, 'Failed to initialize orchestrator');
      throw error;
    }
  }

  /**
   * Start a new workflow
   */
  async startWorkflow({ name, description, steps = [], metadata = {} }) {
    try {
      this.workflowId = uuidv4();
      this.status = 'running';
      this.startTime = Date.now();

      const workflow = {
        id: this.workflowId,
        sessionId: this.sessionId,
        name,
        description,
        steps,
        metadata,
        status: 'running',
        currentStep: 0,
        results: [],
        errors: [],
        createdAt: new Date().toISOString()
      };

      // Save initial state
      await this.stateManager.saveState(this.workflowId, workflow);

      // Store in memory
      await this.memoryManager.store({
        content: `Started workflow: ${name}\nDescription: ${description}`,
        metadata: {
          type: 'workflow_start',
          workflowId: this.workflowId,
          name
        },
        importance: 'high'
      });

      // Notify via Discord
      await this.integrations.discord.notifyWorkflowStart({
        workflowId: this.workflowId,
        description
      });

      // Start auto-checkpointing
      this.stateManager.startAutoCheckpoint(this.workflowId, () => this.getCurrentState());

      logger.info({ workflowId: this.workflowId, name }, 'Workflow started');
      return workflow;
    } catch (error) {
      logger.error({ error, name }, 'Failed to start workflow');
      throw error;
    }
  }

  /**
   * Resume a workflow from checkpoint
   */
  async resumeWorkflow(workflowId, checkpointId = null) {
    try {
      const checkpoint = await this.stateManager.loadCheckpoint(workflowId, checkpointId);

      if (!checkpoint) {
        throw new Error(`No checkpoint found for workflow ${workflowId}`);
      }

      this.workflowId = workflowId;
      this.status = 'running';
      this.startTime = Date.now();

      // Restore state
      const state = checkpoint.state || checkpoint;
      await this.stateManager.saveState(workflowId, {
        ...state,
        status: 'resumed',
        resumedAt: new Date().toISOString()
      });

      // Load relevant memories
      const memories = await this.memoryManager.retrieve({
        query: `workflow ${workflowId}`,
        limit: 20,
        filter: { workflowId }
      });

      logger.info({
        workflowId,
        checkpointId,
        currentStep: state.currentStep,
        memoriesLoaded: memories.length
      }, 'Workflow resumed from checkpoint');

      // Notify
      await this.integrations.discord.sendStatus({
        workflowId,
        status: 'Resumed from checkpoint',
        details: `Continuing from step ${state.currentStep + 1}`
      });

      return state;
    } catch (error) {
      logger.error({ error, workflowId }, 'Failed to resume workflow');
      throw error;
    }
  }

  /**
   * Execute a workflow step with retry logic
   */
  async executeStep(step, retryCount = 0) {
    try {
      logger.info({ step: step.name, attempt: retryCount + 1 }, 'Executing step');

      const result = await this.withTimeout(
        this.runStep(step),
        this.config.timeout
      );

      // Store success in memory
      await this.memoryManager.store({
        content: `Step completed: ${step.name}\nResult: ${JSON.stringify(result)}`,
        metadata: {
          type: 'step_success',
          workflowId: this.workflowId,
          stepName: step.name
        }
      });

      return { success: true, result };
    } catch (error) {
      logger.error({ error, step: step.name, attempt: retryCount + 1 }, 'Step execution failed');

      // Retry logic
      if (retryCount < this.config.maxRetries) {
        const delay = this.config.retryDelay * Math.pow(2, retryCount);
        logger.info({ step: step.name, delay }, 'Retrying step');
        await this.sleep(delay);
        return this.executeStep(step, retryCount + 1);
      }

      // Store failure in memory
      await this.memoryManager.storeError({
        error: error.message,
        recovery: `Failed after ${retryCount + 1} attempts`,
        context: { workflowId: this.workflowId, step: step.name }
      });

      // Notify error
      await this.integrations.discord.notifyWorkflowError({
        workflowId: this.workflowId,
        error: error.message,
        recovery: 'See logs for details'
      });

      return { success: false, error: error.message };
    }
  }

  /**
   * Run a single step
   */
  async runStep(step) {
    const { type, params } = step;

    switch (type) {
      case 'anthropic':
        return await this.integrations.anthropic.sendMessage(params);

      case 'codegen':
        return await this.integrations.codegen.generateCode(params);

      case 'clickup':
        return await this.integrations.clickup.createTask(params);

      case 'linear':
        return await this.integrations.linear.createIssue(params);

      case 'n8n':
        return await this.integrations.n8n.executeWorkflow(params.workflowId, params.data);

      case 'discord':
        return await this.integrations.discord.sendMessage(params.message);

      case 'custom':
        if (typeof params.handler === 'function') {
          return await params.handler(this.integrations);
        }
        throw new Error('Custom step requires a handler function');

      default:
        throw new Error(`Unknown step type: ${type}`);
    }
  }

  /**
   * Execute complete workflow
   */
  async executeWorkflow(workflow) {
    const { steps } = workflow;
    const results = [];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];

      // Update state
      const state = await this.stateManager.loadState(this.workflowId);
      state.currentStep = i;
      await this.stateManager.saveState(this.workflowId, state);

      // Execute step
      const result = await this.executeStep(step);
      results.push(result);

      // Stop on failure if configured
      if (!result.success && step.stopOnFailure) {
        logger.warn({ step: step.name }, 'Stopping workflow due to step failure');
        break;
      }

      // Create checkpoint after each step
      await this.createCheckpoint();
    }

    // Complete workflow
    await this.completeWorkflow(results);
    return results;
  }

  /**
   * Create a checkpoint
   */
  async createCheckpoint() {
    try {
      const state = await this.getCurrentState();
      const checkpointId = await this.stateManager.createCheckpoint(this.workflowId, { state });

      await this.integrations.discord.notifyCheckpoint({
        workflowId: this.workflowId,
        checkpointId,
        status: state.status
      });

      logger.debug({ workflowId: this.workflowId, checkpointId }, 'Checkpoint created');
      return checkpointId;
    } catch (error) {
      logger.error({ error }, 'Failed to create checkpoint');
    }
  }

  /**
   * Get current workflow state
   */
  async getCurrentState() {
    return await this.stateManager.loadState(this.workflowId);
  }

  /**
   * Complete workflow
   */
  async completeWorkflow(results) {
    try {
      const duration = this.formatDuration(Date.now() - this.startTime);
      const state = await this.stateManager.loadState(this.workflowId);

      state.status = 'completed';
      state.completedAt = new Date().toISOString();
      state.duration = duration;
      state.results = results;

      await this.stateManager.saveState(this.workflowId, state);

      // Store in memory
      await this.memoryManager.store({
        content: `Workflow completed: ${state.name}\nDuration: ${duration}`,
        metadata: {
          type: 'workflow_complete',
          workflowId: this.workflowId,
          duration
        },
        importance: 'high'
      });

      // Notify
      await this.integrations.discord.notifyWorkflowComplete({
        workflowId: this.workflowId,
        duration,
        summary: `${results.filter(r => r.success).length}/${results.length} steps succeeded`
      });

      this.stateManager.stopAutoCheckpoint();
      this.status = 'completed';

      logger.info({ workflowId: this.workflowId, duration }, 'Workflow completed');
    } catch (error) {
      logger.error({ error }, 'Failed to complete workflow');
    }
  }

  /**
   * Utility: Run with timeout
   */
  async withTimeout(promise, timeout) {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Operation timed out')), timeout)
      )
    ]);
  }

  /**
   * Utility: Sleep
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Utility: Format duration
   */
  formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  /**
   * Cleanup resources
   */
  async cleanup() {
    try {
      this.stateManager.stopAutoCheckpoint();
      await this.stateManager.disconnect();
      await this.integrations.discord.disconnect();
      logger.info('Orchestrator cleanup complete');
    } catch (error) {
      logger.error({ error }, 'Error during cleanup');
    }
  }
}

export default WorkflowOrchestrator;
