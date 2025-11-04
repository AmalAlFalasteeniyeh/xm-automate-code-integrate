# XM Automate Code Integrate

**AI-Assisted Automation Platform with Persistent Memory**

A robust, containerized orchestration system that solves Claude's context window limitation and manages complex multi-tool workflows with reliable integrations and long-term continuity.

## 🎯 Problem Statement

Claude Code is excellent for reasoning and problem-solving, but its context window limitation causes:
- Loss of progress between sessions
- Inability to maintain continuity in long-running projects
- Workflow loops during testing phases
- Unreliable automation in complex scenarios

## ✨ Solution

This platform provides:

1. **Persistent Memory Layer** - Vector database (ChromaDB) stores all context, decisions, and conversations
2. **Automatic Checkpointing** - Save workflow state at regular intervals and resume from any checkpoint
3. **State Management** - Redis + PostgreSQL for fast state access and durable persistence
4. **Multi-Tool Integration** - Unified adapters for ClickUp, Discord, Linear, n8n, Anthropic, and CodeGen
5. **Automatic Recovery** - Intelligent error detection and recovery strategies
6. **Monitoring & Alerts** - Real-time health checks and notifications

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Workflow Orchestrator                     │
│  (Checkpoint/Resume, Retry Logic, Error Handling)           │
└───────────┬─────────────────────────────────────┬───────────┘
            │                                     │
    ┌───────▼────────┐                   ┌────────▼────────┐
    │ Memory Manager │                   │  State Manager  │
    │   (ChromaDB)   │                   │ (Redis + Files) │
    └────────────────┘                   └─────────────────┘
            │                                     │
    ┌───────▼─────────────────────────────────────▼───────────┐
    │              Integration Adapters                        │
    │  Anthropic │ ClickUp │ Discord │ Linear │ n8n │ CodeGen │
    └──────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- API keys for your integrations

### Installation

1. **Clone and setup**
   ```bash
   git clone <repository-url>
   cd xm-automate-code-integrate
   cp .env.example .env
   ```

2. **Configure environment variables**
   Edit `.env` with your API keys:
   ```env
   ANTHROPIC_API_KEY=your_key_here
   CLICKUP_API_KEY=your_key_here
   DISCORD_BOT_TOKEN=your_token_here
   LINEAR_API_KEY=your_key_here
   N8N_API_KEY=your_key_here
   CODEGEN_API_KEY=your_key_here
   ```

3. **Start with Docker**
   ```bash
   npm run docker:build
   npm run docker:run
   ```

4. **Or run locally**
   ```bash
   npm install
   npm start
   ```

The platform will be available at:
- API: `http://localhost:3000`
- ChromaDB: `http://localhost:8000`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

## 📖 Usage

### Creating a Workflow

```javascript
POST /api/workflows
{
  "name": "AI Code Generation",
  "description": "Generate and review code using AI",
  "steps": [
    {
      "name": "Analyze Requirements",
      "type": "anthropic",
      "params": {
        "message": "Analyze these requirements...",
        "systemPrompt": "You are a technical architect"
      }
    },
    {
      "name": "Generate Code",
      "type": "codegen",
      "params": {
        "specification": "${steps[0].result.message}",
        "language": "javascript"
      }
    },
    {
      "name": "Create Task",
      "type": "clickup",
      "params": {
        "listId": "your-list-id",
        "name": "Review Generated Code",
        "description": "${steps[1].result.code}"
      }
    }
  ]
}
```

### Resuming from Checkpoint

```javascript
POST /api/workflows/:id/resume
{
  "checkpointId": "optional-checkpoint-id"
}
```

### Monitoring

```javascript
// Get workflow status
GET /api/workflows/:id

// Get workflow history
GET /api/workflows/:id/history

// Get memory context
GET /api/memory/context

// Search memories
POST /api/memory/search
{
  "query": "error handling strategy",
  "limit": 10
}
```

## 🔧 Integration Guides

### Anthropic (Claude)

The Anthropic adapter automatically:
- Retrieves relevant context from memory before each request
- Stores conversations for future reference
- Manages token usage and conversation history
- Supports code generation, analysis, and decision-making

### ClickUp

Manage tasks programmatically:
```javascript
await orchestrator.integrations.clickup.createTask({
  listId: 'your-list-id',
  name: 'Task Name',
  description: 'Task description',
  priority: 1,
  tags: ['automation', 'ai-generated']
});
```

### Discord

Receive notifications:
- Workflow start/completion
- Errors and recovery attempts
- Checkpoint creation
- Custom status updates

### Linear

Track development progress:
```javascript
await orchestrator.integrations.linear.createIssue({
  title: 'Generated Code Review',
  description: 'Review AI-generated code',
  priority: 2
});
```

### n8n

Execute automation workflows:
```javascript
await orchestrator.integrations.n8n.executeWorkflow(
  'workflow-id',
  { data: 'your-data' }
);
```

### CodeGen

Generate code from specifications:
```javascript
await orchestrator.integrations.codegen.generateCode({
  specification: 'API specification',
  language: 'typescript',
  template: 'rest-api'
});
```

## 🛡️ Error Recovery

The platform includes automatic recovery for:

- **Network Timeouts** - Automatic retry with exponential backoff
- **API Rate Limits** - Waits for rate limit reset
- **Service Unavailable** - Checks service availability before retry
- **Memory Overflow** - Clears Claude's conversation history
- **Data Inconsistency** - Restores from last valid checkpoint

### Custom Recovery Strategies

```javascript
recoveryManager.registerStrategy('custom_error', async (context) => {
  // Your recovery logic
  return { success: true, message: 'Recovered' };
});
```

## 📊 Monitoring & Metrics

The platform tracks:
- Workflows started/completed/failed
- Success rates
- Average workflow duration
- Step execution statistics
- System health checks

Access metrics via:
```javascript
GET /health
```

## 🔐 Security

- Environment variables for all API keys
- No hardcoded credentials
- Secrets stored securely in `.env` (never committed)
- Docker secrets support for production

## 🐳 Docker Deployment

### Production Deployment

```bash
# Build and deploy
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Scaling

The platform is designed to scale horizontally. You can:
- Run multiple orchestrator instances
- Use external Redis/PostgreSQL clusters
- Deploy ChromaDB separately

## 📝 Example Workflows

### 1. Code Generation with Review

```javascript
{
  "name": "Generate and Review Code",
  "steps": [
    { "type": "anthropic", "params": { "message": "Create spec..." } },
    { "type": "codegen", "params": { "specification": "..." } },
    { "type": "anthropic", "params": { "message": "Review code..." } },
    { "type": "linear", "params": { "title": "Code Review" } },
    { "type": "discord", "params": { "message": "Review ready!" } }
  ]
}
```

### 2. Automated Testing & Deployment

```javascript
{
  "name": "Test and Deploy",
  "steps": [
    { "type": "n8n", "params": { "workflowId": "run-tests" } },
    { "type": "anthropic", "params": { "message": "Analyze results..." } },
    { "type": "n8n", "params": { "workflowId": "deploy" } },
    { "type": "clickup", "params": { "name": "Deployment complete" } }
  ]
}
```

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- GitHub Issues: [Create an issue]
- Documentation: See `/docs` folder
- Discord: [Join our server]

## 🗺️ Roadmap

- [ ] Web dashboard for workflow monitoring
- [ ] GraphQL API
- [ ] Workflow templates library
- [ ] AI-powered workflow optimization
- [ ] Multi-tenancy support
- [ ] Cloud deployment templates (AWS, GCP, Azure)