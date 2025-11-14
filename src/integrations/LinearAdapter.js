import { LinearClient } from '@linear/sdk';
import logger from '../utils/logger.js';

/**
 * Linear Adapter
 * Manages issues, projects, and development tracking
 */
class LinearAdapter {
  constructor(config) {
    this.config = config;
    this.client = new LinearClient({
      apiKey: process.env.LINEAR_API_KEY
    });
    this.teamId = process.env.LINEAR_TEAM_ID;
  }

  /**
   * Create an issue
   */
  async createIssue({ title, description, priority = 3, labels = [], assigneeId = null }) {
    try {
      const issue = await this.client.createIssue({
        teamId: this.teamId,
        title,
        description,
        priority,
        labelIds: labels,
        assigneeId
      });

      const issueData = await issue.issue;
      logger.info({ issueId: issueData?.id, title }, 'Linear issue created');
      return issueData;
    } catch (error) {
      logger.error({ error, title }, 'Failed to create Linear issue');
      throw error;
    }
  }

  /**
   * Update issue status
   */
  async updateIssue(issueId, updates) {
    try {
      const result = await this.client.updateIssue(issueId, updates);
      logger.info({ issueId, updates }, 'Linear issue updated');
      return result;
    } catch (error) {
      logger.error({ error, issueId }, 'Failed to update Linear issue');
      throw error;
    }
  }

  /**
   * Get issue details
   */
  async getIssue(issueId) {
    try {
      return await this.client.issue(issueId);
    } catch (error) {
      logger.error({ error, issueId }, 'Failed to get Linear issue');
      throw error;
    }
  }

  /**
   * Add comment to issue
   */
  async addComment(issueId, body) {
    try {
      const result = await this.client.createComment({
        issueId,
        body
      });

      logger.info({ issueId }, 'Comment added to Linear issue');
      return result;
    } catch (error) {
      logger.error({ error, issueId }, 'Failed to add comment');
      throw error;
    }
  }

  /**
   * Search issues
   */
  async searchIssues(query) {
    try {
      const result = await this.client.searchIssues(query);
      return result.nodes;
    } catch (error) {
      logger.error({ error, query }, 'Failed to search Linear issues');
      throw error;
    }
  }

  /**
   * Create workflow tracking issue
   */
  async createWorkflowIssue({ workflowId, status, description }) {
    return this.createIssue({
      title: `Workflow ${workflowId}: ${status}`,
      description,
      labels: ['automation', 'workflow']
    });
  }

  /**
   * Get team workflow states
   */
  async getWorkflowStates() {
    try {
      const team = await this.client.team(this.teamId);
      const states = await team.states();
      return states.nodes;
    } catch (error) {
      logger.error({ error }, 'Failed to get workflow states');
      throw error;
    }
  }
}

export default LinearAdapter;
