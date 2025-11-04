import Anthropic from '@anthropic-ai/sdk';
import logger from '../utils/logger.js';

/**
 * Anthropic Claude Adapter
 * Manages interactions with Claude API with context preservation
 */
class AnthropicAdapter {
  constructor(config, memoryManager) {
    this.config = config;
    this.memoryManager = memoryManager;
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    this.conversationHistory = [];
    this.maxTokens = parseInt(process.env.MAX_CONTEXT_TOKENS) || 180000;
  }

  /**
   * Send message to Claude with memory context
   */
  async sendMessage({ message, systemPrompt = '', maxTokens = 4096 }) {
    try {
      // Retrieve relevant context from memory
      const relevantMemories = await this.memoryManager.retrieve({
        query: message,
        limit: 5
      });

      const contextSummary = relevantMemories
        .map(m => m.content)
        .join('\n\n');

      // Build enhanced system prompt with context
      const enhancedSystemPrompt = `${systemPrompt}

## Relevant Context from Previous Sessions:
${contextSummary}

Remember: You have access to persistent memory. Important decisions and context are preserved across sessions.`;

      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: message
      });

      // Make API call
      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: maxTokens,
        system: enhancedSystemPrompt,
        messages: this.conversationHistory
      });

      const assistantMessage = response.content[0].text;

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage
      });

      // Store in memory
      await this.memoryManager.store({
        content: `User: ${message}\nAssistant: ${assistantMessage}`,
        metadata: {
          type: 'conversation',
          tokens: response.usage.input_tokens + response.usage.output_tokens
        }
      });

      logger.info({
        tokens: response.usage,
        stopReason: response.stop_reason
      }, 'Claude response received');

      return {
        message: assistantMessage,
        usage: response.usage,
        stopReason: response.stop_reason
      };
    } catch (error) {
      logger.error({ error, message }, 'Failed to send message to Claude');
      throw error;
    }
  }

  /**
   * Analyze code with Claude
   */
  async analyzeCode({ code, language, task }) {
    const message = `Analyze the following ${language} code and ${task}:\n\n\`\`\`${language}\n${code}\n\`\`\``;

    return this.sendMessage({
      message,
      systemPrompt: 'You are an expert code analyst. Provide detailed, actionable insights.'
    });
  }

  /**
   * Generate code with Claude
   */
  async generateCode({ requirements, language, context = '' }) {
    const message = `Generate ${language} code for the following requirements:\n\n${requirements}\n\nContext: ${context}`;

    return this.sendMessage({
      message,
      systemPrompt: 'You are an expert software engineer. Generate clean, production-ready code.'
    });
  }

  /**
   * Review and improve code
   */
  async reviewCode({ code, language, focusAreas = [] }) {
    const focus = focusAreas.length > 0 ? `\n\nFocus on: ${focusAreas.join(', ')}` : '';
    const message = `Review the following ${language} code and suggest improvements:${focus}\n\n\`\`\`${language}\n${code}\n\`\`\``;

    return this.sendMessage({
      message,
      systemPrompt: 'You are an expert code reviewer. Provide constructive feedback and specific improvements.'
    });
  }

  /**
   * Make decisions based on context
   */
  async makeDecision({ situation, options, constraints = [] }) {
    const constraintsText = constraints.length > 0 ? `\n\nConstraints:\n${constraints.map(c => `- ${c}`).join('\n')}` : '';
    const optionsText = options.map((opt, idx) => `${idx + 1}. ${opt}`).join('\n');

    const message = `Given the situation:\n${situation}\n\nChoose from these options:\n${optionsText}${constraintsText}\n\nProvide your decision with reasoning.`;

    const response = await this.sendMessage({
      message,
      systemPrompt: 'You are a strategic decision maker. Consider all factors and provide clear reasoning.'
    });

    // Store decision in memory
    await this.memoryManager.storeDecision({
      decision: response.message,
      reasoning: 'Claude API decision',
      context: { situation, options, constraints }
    });

    return response;
  }

  /**
   * Reset conversation history (use when context window is getting full)
   */
  async resetConversation() {
    this.conversationHistory = [];
    logger.info('Conversation history reset');
  }

  /**
   * Get current token usage
   */
  getCurrentTokenUsage() {
    // Approximate token count
    const totalChars = this.conversationHistory
      .reduce((sum, msg) => sum + msg.content.length, 0);
    return Math.floor(totalChars / 4); // Rough estimate: ~4 chars per token
  }
}

export default AnthropicAdapter;
