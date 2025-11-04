import logger from '../utils/logger.js';

/**
 * n8n Adapter
 * Manages workflow automation and triggers
 */
class N8NAdapter {
  constructor(config) {
    this.config = config;
    this.apiKey = process.env.N8N_API_KEY;
    this.baseUrl = process.env.N8N_BASE_URL || 'http://localhost:5678/api/v1';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'X-N8N-API-KEY': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`n8n API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow(workflowId, data = {}) {
    try {
      const result = await this.request(`/workflows/${workflowId}/execute`, {
        method: 'POST',
        body: JSON.stringify(data)
      });

      logger.info({ workflowId, executionId: result.data?.executionId }, 'n8n workflow executed');
      return result;
    } catch (error) {
      logger.error({ error, workflowId }, 'Failed to execute n8n workflow');
      throw error;
    }
  }

  /**
   * Get workflow execution status
   */
  async getExecutionStatus(executionId) {
    try {
      return await this.request(`/executions/${executionId}`);
    } catch (error) {
      logger.error({ error, executionId }, 'Failed to get execution status');
      throw error;
    }
  }

  /**
   * Trigger webhook
   */
  async triggerWebhook(webhookPath, data = {}) {
    try {
      const url = `${this.baseUrl.replace('/api/v1', '')}/webhook/${webhookPath}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Webhook trigger failed: ${response.status}`);
      }

      const result = await response.json();
      logger.info({ webhookPath }, 'n8n webhook triggered');
      return result;
    } catch (error) {
      logger.error({ error, webhookPath }, 'Failed to trigger webhook');
      throw error;
    }
  }

  /**
   * Get workflow details
   */
  async getWorkflow(workflowId) {
    try {
      return await this.request(`/workflows/${workflowId}`);
    } catch (error) {
      logger.error({ error, workflowId }, 'Failed to get workflow');
      throw error;
    }
  }

  /**
   * List all workflows
   */
  async listWorkflows() {
    try {
      const result = await this.request('/workflows');
      return result.data;
    } catch (error) {
      logger.error({ error }, 'Failed to list workflows');
      throw error;
    }
  }

  /**
   * Create a new workflow
   */
  async createWorkflow({ name, nodes, connections, settings = {} }) {
    try {
      const workflow = await this.request('/workflows', {
        method: 'POST',
        body: JSON.stringify({
          name,
          nodes,
          connections,
          settings,
          active: false
        })
      });

      logger.info({ workflowId: workflow.data?.id, name }, 'n8n workflow created');
      return workflow.data;
    } catch (error) {
      logger.error({ error, name }, 'Failed to create workflow');
      throw error;
    }
  }

  /**
   * Activate/deactivate workflow
   */
  async setWorkflowActive(workflowId, active = true) {
    try {
      const result = await this.request(`/workflows/${workflowId}`, {
        method: 'PATCH',
        body: JSON.stringify({ active })
      });

      logger.info({ workflowId, active }, 'n8n workflow active status changed');
      return result;
    } catch (error) {
      logger.error({ error, workflowId }, 'Failed to set workflow active status');
      throw error;
    }
  }
}

export default N8NAdapter;
