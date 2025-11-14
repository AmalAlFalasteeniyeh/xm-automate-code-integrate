import logger from '../utils/logger.js';

/**
 * ClickUp Adapter
 * Manages tasks, lists, and project tracking
 */
class ClickUpAdapter {
  constructor(config) {
    this.config = config;
    this.apiKey = process.env.CLICKUP_API_KEY;
    this.teamId = process.env.CLICKUP_TEAM_ID;
    this.baseUrl = 'https://api.clickup.com/api/v2';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`ClickUp API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * Create a task
   */
  async createTask({ listId, name, description, priority, assignees = [], tags = [] }) {
    try {
      const task = await this.request(`/list/${listId}/task`, {
        method: 'POST',
        body: JSON.stringify({
          name,
          description,
          priority: priority || 3,
          assignees,
          tags
        })
      });

      logger.info({ taskId: task.id, name }, 'ClickUp task created');
      return task;
    } catch (error) {
      logger.error({ error, listId, name }, 'Failed to create ClickUp task');
      throw error;
    }
  }

  /**
   * Update task status
   */
  async updateTaskStatus(taskId, status) {
    try {
      const task = await this.request(`/task/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });

      logger.info({ taskId, status }, 'ClickUp task status updated');
      return task;
    } catch (error) {
      logger.error({ error, taskId, status }, 'Failed to update task status');
      throw error;
    }
  }

  /**
   * Get task details
   */
  async getTask(taskId) {
    try {
      return await this.request(`/task/${taskId}`);
    } catch (error) {
      logger.error({ error, taskId }, 'Failed to get task');
      throw error;
    }
  }

  /**
   * Add comment to task
   */
  async addComment(taskId, comment) {
    try {
      const result = await this.request(`/task/${taskId}/comment`, {
        method: 'POST',
        body: JSON.stringify({
          comment_text: comment
        })
      });

      logger.info({ taskId }, 'Comment added to ClickUp task');
      return result;
    } catch (error) {
      logger.error({ error, taskId }, 'Failed to add comment');
      throw error;
    }
  }

  /**
   * Get tasks in list
   */
  async getTasksInList(listId, options = {}) {
    try {
      const queryParams = new URLSearchParams(options);
      return await this.request(`/list/${listId}/task?${queryParams}`);
    } catch (error) {
      logger.error({ error, listId }, 'Failed to get tasks');
      throw error;
    }
  }

  /**
   * Create workflow automation task
   */
  async createWorkflowTask({ listId, workflowId, status, description }) {
    return this.createTask({
      listId,
      name: `Workflow ${workflowId} - ${status}`,
      description,
      tags: ['automation', 'workflow', workflowId]
    });
  }
}

export default ClickUpAdapter;
