import logger from '../utils/logger.js';

/**
 * System Monitor - Tracks health, performance, and issues
 */
class Monitor {
  constructor(orchestrator) {
    this.orchestrator = orchestrator;
    this.metrics = {
      workflowsStarted: 0,
      workflowsCompleted: 0,
      workflowsFailed: 0,
      totalSteps: 0,
      failedSteps: 0,
      checkpointsCreated: 0,
      averageWorkflowDuration: 0
    };
    this.alerts = [];
  }

  /**
   * Record workflow start
   */
  recordWorkflowStart(workflowId) {
    this.metrics.workflowsStarted++;
    logger.info({ workflowId, metric: 'workflow_started' }, 'Workflow started');
  }

  /**
   * Record workflow completion
   */
  recordWorkflowComplete(workflowId, duration) {
    this.metrics.workflowsCompleted++;

    // Update average duration
    const total = this.metrics.averageWorkflowDuration * (this.metrics.workflowsCompleted - 1);
    this.metrics.averageWorkflowDuration = (total + duration) / this.metrics.workflowsCompleted;

    logger.info({
      workflowId,
      duration,
      metric: 'workflow_completed'
    }, 'Workflow completed');
  }

  /**
   * Record workflow failure
   */
  recordWorkflowFailure(workflowId, error) {
    this.metrics.workflowsFailed++;

    this.addAlert({
      type: 'workflow_failure',
      workflowId,
      error: error.message,
      timestamp: new Date().toISOString()
    });

    logger.error({
      workflowId,
      error,
      metric: 'workflow_failed'
    }, 'Workflow failed');
  }

  /**
   * Record step execution
   */
  recordStepExecution(workflowId, stepName, success, duration) {
    this.metrics.totalSteps++;

    if (!success) {
      this.metrics.failedSteps++;

      this.addAlert({
        type: 'step_failure',
        workflowId,
        stepName,
        timestamp: new Date().toISOString()
      });
    }

    logger.debug({
      workflowId,
      stepName,
      success,
      duration,
      metric: 'step_executed'
    }, 'Step executed');
  }

  /**
   * Record checkpoint creation
   */
  recordCheckpoint(workflowId, checkpointId) {
    this.metrics.checkpointsCreated++;

    logger.debug({
      workflowId,
      checkpointId,
      metric: 'checkpoint_created'
    }, 'Checkpoint created');
  }

  /**
   * Add alert
   */
  addAlert(alert) {
    this.alerts.push(alert);

    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }

    logger.warn({ alert }, 'Alert added');
  }

  /**
   * Get system metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      successRate: this.metrics.workflowsStarted > 0
        ? (this.metrics.workflowsCompleted / this.metrics.workflowsStarted * 100).toFixed(2) + '%'
        : 'N/A',
      stepSuccessRate: this.metrics.totalSteps > 0
        ? ((this.metrics.totalSteps - this.metrics.failedSteps) / this.metrics.totalSteps * 100).toFixed(2) + '%'
        : 'N/A'
    };
  }

  /**
   * Get recent alerts
   */
  getAlerts(limit = 10) {
    return this.alerts.slice(-limit);
  }

  /**
   * Check system health
   */
  async checkHealth() {
    const health = {
      status: 'healthy',
      checks: {},
      timestamp: new Date().toISOString()
    };

    try {
      // Check Redis connection
      if (this.orchestrator.stateManager.redis) {
        await this.orchestrator.stateManager.redis.ping();
        health.checks.redis = 'connected';
      }
    } catch (error) {
      health.status = 'unhealthy';
      health.checks.redis = 'disconnected';
      logger.error({ error }, 'Redis health check failed');
    }

    try {
      // Check memory manager
      const summary = await this.orchestrator.memoryManager.getContextSummary();
      health.checks.memory = summary ? 'operational' : 'degraded';
    } catch (error) {
      health.status = 'degraded';
      health.checks.memory = 'error';
      logger.error({ error }, 'Memory health check failed');
    }

    // Check failure rate
    const failureRate = this.metrics.workflowsStarted > 0
      ? this.metrics.workflowsFailed / this.metrics.workflowsStarted
      : 0;

    if (failureRate > 0.5) {
      health.status = 'degraded';
      health.checks.failureRate = 'high';
      this.addAlert({
        type: 'high_failure_rate',
        rate: (failureRate * 100).toFixed(2) + '%',
        timestamp: new Date().toISOString()
      });
    } else {
      health.checks.failureRate = 'normal';
    }

    return health;
  }

  /**
   * Reset metrics
   */
  resetMetrics() {
    this.metrics = {
      workflowsStarted: 0,
      workflowsCompleted: 0,
      workflowsFailed: 0,
      totalSteps: 0,
      failedSteps: 0,
      checkpointsCreated: 0,
      averageWorkflowDuration: 0
    };
    logger.info('Metrics reset');
  }
}

export default Monitor;
