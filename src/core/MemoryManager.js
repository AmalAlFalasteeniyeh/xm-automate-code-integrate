import { ChromaClient } from 'chromadb';
import { createHash } from 'crypto';
import logger from '../utils/logger.js';

/**
 * Memory Manager - Solves Claude's context window limitation
 *
 * Features:
 * - Stores conversation history, decisions, and context in vector DB
 * - Retrieves relevant context based on semantic similarity
 * - Maintains long-term memory across sessions
 * - Automatically saves checkpoints
 */
class MemoryManager {
  constructor(config) {
    this.config = config;
    this.client = null;
    this.collection = null;
    this.sessionId = null;
  }

  async initialize(sessionId) {
    try {
      this.sessionId = sessionId;
      this.client = new ChromaClient({
        path: process.env.CHROMA_URL || 'http://localhost:8000'
      });

      // Create or get collection for this workflow
      this.collection = await this.client.getOrCreateCollection({
        name: 'workflow_memory',
        metadata: { 'hnsw:space': 'cosine' }
      });

      logger.info({ sessionId }, 'Memory manager initialized');
    } catch (error) {
      logger.error({ error, sessionId }, 'Failed to initialize memory manager');
      throw error;
    }
  }

  /**
   * Store a memory entry with context
   */
  async store({ content, metadata = {}, importance = 'normal' }) {
    try {
      const id = this.generateId(content);
      const timestamp = new Date().toISOString();

      await this.collection.add({
        ids: [id],
        documents: [content],
        metadatas: [{
          sessionId: this.sessionId,
          timestamp,
          importance,
          type: metadata.type || 'general',
          ...metadata
        }]
      });

      logger.debug({ id, importance }, 'Memory stored');
      return id;
    } catch (error) {
      logger.error({ error, content }, 'Failed to store memory');
      throw error;
    }
  }

  /**
   * Retrieve relevant memories based on query
   */
  async retrieve({ query, limit = 10, filter = {} }) {
    try {
      const results = await this.collection.query({
        queryTexts: [query],
        nResults: limit,
        where: {
          sessionId: this.sessionId,
          ...filter
        }
      });

      const memories = results.documents[0].map((doc, idx) => ({
        content: doc,
        metadata: results.metadatas[0][idx],
        distance: results.distances[0][idx],
        id: results.ids[0][idx]
      }));

      logger.debug({ query, count: memories.length }, 'Memories retrieved');
      return memories;
    } catch (error) {
      logger.error({ error, query }, 'Failed to retrieve memories');
      return [];
    }
  }

  /**
   * Store a workflow decision or important event
   */
  async storeDecision({ decision, reasoning, context = {} }) {
    return this.store({
      content: `Decision: ${decision}\nReasoning: ${reasoning}`,
      metadata: {
        type: 'decision',
        decision,
        reasoning,
        ...context
      },
      importance: 'high'
    });
  }

  /**
   * Store error and recovery information
   */
  async storeError({ error, recovery, context = {} }) {
    return this.store({
      content: `Error: ${error}\nRecovery: ${recovery}`,
      metadata: {
        type: 'error',
        error,
        recovery,
        ...context
      },
      importance: 'high'
    });
  }

  /**
   * Get workflow context summary
   */
  async getContextSummary() {
    try {
      const recentMemories = await this.collection.get({
        where: { sessionId: this.sessionId },
        limit: 50
      });

      const summary = {
        totalMemories: recentMemories.ids.length,
        decisions: recentMemories.metadatas.filter(m => m.type === 'decision').length,
        errors: recentMemories.metadatas.filter(m => m.type === 'error').length,
        lastActivity: recentMemories.metadatas[0]?.timestamp || null
      };

      return summary;
    } catch (error) {
      logger.error({ error }, 'Failed to get context summary');
      return null;
    }
  }

  /**
   * Clear memories for a session (use with caution)
   */
  async clearSession(sessionId = this.sessionId) {
    try {
      const memories = await this.collection.get({
        where: { sessionId }
      });

      if (memories.ids.length > 0) {
        await this.collection.delete({
          ids: memories.ids
        });
      }

      logger.info({ sessionId, count: memories.ids.length }, 'Session memories cleared');
    } catch (error) {
      logger.error({ error, sessionId }, 'Failed to clear session');
      throw error;
    }
  }

  generateId(content) {
    const timestamp = Date.now();
    const hash = createHash('sha256')
      .update(`${content}-${timestamp}`)
      .digest('hex')
      .substring(0, 16);
    return `${this.sessionId}-${hash}`;
  }
}

export default MemoryManager;
