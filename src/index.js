import dotenv from 'dotenv';
import express from 'express';
import logger from './utils/logger.js';
import WorkflowOrchestrator from './core/WorkflowOrchestrator.js';

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

let orchestrator = null;

/**
 * Initialize the orchestrator
 */
async function initialize() {
  try {
    orchestrator = new WorkflowOrchestrator();
    await orchestrator.initialize();
    logger.info('Application initialized successfully');
  } catch (error) {
    logger.error({ error }, 'Failed to initialize application');
    process.exit(1);
  }
}

/**
 * API Routes
 */

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Start a new workflow
app.post('/api/workflows', async (req, res) => {
  try {
    const { name, description, steps, metadata } = req.body;

    const workflow = await orchestrator.startWorkflow({
      name,
      description,
      steps,
      metadata
    });

    res.json({
      success: true,
      workflow
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start workflow');
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Execute a workflow
app.post('/api/workflows/:id/execute', async (req, res) => {
  try {
    const { id } = req.params;
    const workflow = await orchestrator.stateManager.loadState(id);

    if (!workflow) {
      return res.status(404).json({
        success: false,
        error: 'Workflow not found'
      });
    }

    // Execute workflow asynchronously
    orchestrator.executeWorkflow(workflow).catch(error => {
      logger.error({ error, workflowId: id }, 'Workflow execution failed');
    });

    res.json({
      success: true,
      message: 'Workflow execution started',
      workflowId: id
    });
  } catch (error) {
    logger.error({ error }, 'Failed to execute workflow');
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Resume a workflow from checkpoint
app.post('/api/workflows/:id/resume', async (req, res) => {
  try {
    const { id } = req.params;
    const { checkpointId } = req.body;

    const workflow = await orchestrator.resumeWorkflow(id, checkpointId);

    res.json({
      success: true,
      workflow
    });
  } catch (error) {
    logger.error({ error }, 'Failed to resume workflow');
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get workflow status
app.get('/api/workflows/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const workflow = await orchestrator.stateManager.loadState(id);

    if (!workflow) {
      return res.status(404).json({
        success: false,
        error: 'Workflow not found'
      });
    }

    res.json({
      success: true,
      workflow
    });
  } catch (error) {
    logger.error({ error }, 'Failed to get workflow');
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get workflow history
app.get('/api/workflows/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const history = await orchestrator.stateManager.getHistory(id, limit);

    res.json({
      success: true,
      history
    });
  } catch (error) {
    logger.error({ error }, 'Failed to get workflow history');
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get memory context
app.get('/api/memory/context', async (req, res) => {
  try {
    const summary = await orchestrator.memoryManager.getContextSummary();

    res.json({
      success: true,
      summary
    });
  } catch (error) {
    logger.error({ error }, 'Failed to get memory context');
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Search memories
app.post('/api/memory/search', async (req, res) => {
  try {
    const { query, limit } = req.body;

    const memories = await orchestrator.memoryManager.retrieve({
      query,
      limit: limit || 10
    });

    res.json({
      success: true,
      memories
    });
  } catch (error) {
    logger.error({ error }, 'Failed to search memories');
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Example workflow endpoint
 */
app.post('/api/workflows/examples/code-generation', async (req, res) => {
  try {
    const { requirements, language } = req.body;

    const workflow = await orchestrator.startWorkflow({
      name: 'AI-Assisted Code Generation',
      description: `Generate ${language} code from requirements`,
      steps: [
        {
          name: 'Analyze Requirements',
          type: 'anthropic',
          params: {
            message: `Analyze these requirements and create a technical specification: ${requirements}`,
            systemPrompt: 'You are a technical architect. Create detailed specifications.'
          }
        },
        {
          name: 'Generate Code',
          type: 'codegen',
          params: {
            specification: '${steps[0].result.message}',
            language
          }
        },
        {
          name: 'Review Code',
          type: 'anthropic',
          params: {
            message: 'Review the generated code: ${steps[1].result.code}',
            systemPrompt: 'You are a code reviewer. Identify issues and suggest improvements.'
          }
        },
        {
          name: 'Create Linear Issue',
          type: 'linear',
          params: {
            title: 'Code Review: ${workflow.name}',
            description: '${steps[2].result.message}'
          }
        },
        {
          name: 'Notify Team',
          type: 'discord',
          params: {
            message: 'Code generation complete! Review in Linear: ${steps[3].result.url}'
          }
        }
      ],
      metadata: { language, requirements }
    });

    // Start execution
    orchestrator.executeWorkflow(workflow);

    res.json({
      success: true,
      workflowId: workflow.id,
      message: 'Workflow started'
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start code generation workflow');
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Graceful shutdown
 */
async function shutdown() {
  logger.info('Shutting down gracefully...');

  if (orchestrator) {
    await orchestrator.cleanup();
  }

  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

/**
 * Start server
 */
const PORT = process.env.PORT || 3000;

initialize().then(() => {
  app.listen(PORT, () => {
    logger.info({ port: PORT }, 'Server started');
  });
});

export default app;
