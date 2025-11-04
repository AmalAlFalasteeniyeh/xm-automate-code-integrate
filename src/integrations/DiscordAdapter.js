import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import logger from '../utils/logger.js';

/**
 * Discord Adapter
 * Manages notifications and team communication
 */
class DiscordAdapter {
  constructor(config) {
    this.config = config;
    this.client = null;
    this.channelId = process.env.DISCORD_CHANNEL_ID;
    this.isReady = false;
  }

  async initialize() {
    try {
      this.client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent
        ]
      });

      this.client.on('ready', () => {
        this.isReady = true;
        logger.info({ user: this.client.user.tag }, 'Discord bot ready');
      });

      this.client.on('error', (error) => {
        logger.error({ error }, 'Discord client error');
      });

      await this.client.login(process.env.DISCORD_BOT_TOKEN);
    } catch (error) {
      logger.error({ error }, 'Failed to initialize Discord');
      throw error;
    }
  }

  /**
   * Send a message to channel
   */
  async sendMessage(message, channelId = this.channelId) {
    if (!this.isReady) {
      throw new Error('Discord client not ready');
    }

    try {
      const channel = await this.client.channels.fetch(channelId);
      const sent = await channel.send(message);
      logger.debug({ channelId, messageId: sent.id }, 'Discord message sent');
      return sent;
    } catch (error) {
      logger.error({ error, channelId }, 'Failed to send Discord message');
      throw error;
    }
  }

  /**
   * Send rich embed message
   */
  async sendEmbed({ title, description, color = 0x0099ff, fields = [] }, channelId = this.channelId) {
    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(color)
      .setTimestamp();

    if (fields.length > 0) {
      embed.addFields(fields);
    }

    return this.sendMessage({ embeds: [embed] }, channelId);
  }

  /**
   * Notify workflow start
   */
  async notifyWorkflowStart({ workflowId, description }) {
    return this.sendEmbed({
      title: '🚀 Workflow Started',
      description: `Workflow \`${workflowId}\` has been initiated`,
      color: 0x00ff00,
      fields: [
        { name: 'Description', value: description || 'N/A' },
        { name: 'Status', value: 'Running' }
      ]
    });
  }

  /**
   * Notify workflow completion
   */
  async notifyWorkflowComplete({ workflowId, duration, summary }) {
    return this.sendEmbed({
      title: '✅ Workflow Completed',
      description: `Workflow \`${workflowId}\` completed successfully`,
      color: 0x00ff00,
      fields: [
        { name: 'Duration', value: duration },
        { name: 'Summary', value: summary || 'N/A' }
      ]
    });
  }

  /**
   * Notify workflow error
   */
  async notifyWorkflowError({ workflowId, error, recovery }) {
    return this.sendEmbed({
      title: '❌ Workflow Error',
      description: `Workflow \`${workflowId}\` encountered an error`,
      color: 0xff0000,
      fields: [
        { name: 'Error', value: error.substring(0, 1024) },
        { name: 'Recovery Action', value: recovery || 'Manual intervention required' }
      ]
    });
  }

  /**
   * Notify checkpoint created
   */
  async notifyCheckpoint({ workflowId, checkpointId, status }) {
    return this.sendEmbed({
      title: '💾 Checkpoint Created',
      description: `Workflow \`${workflowId}\` checkpoint saved`,
      color: 0xffa500,
      fields: [
        { name: 'Checkpoint ID', value: checkpointId },
        { name: 'Status', value: status }
      ]
    });
  }

  /**
   * Send status update
   */
  async sendStatus({ workflowId, status, details }) {
    return this.sendMessage(`**Workflow ${workflowId}**: ${status}\n${details || ''}`);
  }

  async disconnect() {
    if (this.client) {
      await this.client.destroy();
      this.isReady = false;
      logger.info('Discord client disconnected');
    }
  }
}

export default DiscordAdapter;
