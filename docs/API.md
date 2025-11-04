# API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, the API does not require authentication. In production, implement authentication using:
- API keys
- JWT tokens
- OAuth 2.0

## Endpoints

### Workflows

#### Create Workflow

Creates a new workflow.

**Request:**
```http
POST /api/workflows
Content-Type: application/json

{
  "name": "string",
  "description": "string",
  "steps": [
    {
      "name": "string",
      "type": "anthropic|codegen|clickup|linear|n8n|discord|custom",
      "params": {},
      "stopOnFailure": boolean
    }
  ],
  "metadata": {}
}
```

**Response:**
```json
{
  "success": true,
  "workflow": {
    "id": "uuid",
    "sessionId": "uuid",
    "name": "string",
    "description": "string",
    "status": "running",
    "currentStep": 0,
    "createdAt": "ISO8601"
  }
}
```

#### Execute Workflow

Executes a created workflow.

**Request:**
```http
POST /api/workflows/:id/execute
```

**Response:**
```json
{
  "success": true,
  "message": "Workflow execution started",
  "workflowId": "uuid"
}
```

#### Resume Workflow

Resumes a workflow from a checkpoint.

**Request:**
```http
POST /api/workflows/:id/resume
Content-Type: application/json

{
  "checkpointId": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "workflow": {
    "id": "uuid",
    "status": "resumed",
    "currentStep": 2,
    "resumedAt": "ISO8601"
  }
}
```

#### Get Workflow Status

Retrieves the current status of a workflow.

**Request:**
```http
GET /api/workflows/:id
```

**Response:**
```json
{
  "success": true,
  "workflow": {
    "id": "uuid",
    "name": "string",
    "status": "running|completed|failed",
    "currentStep": 2,
    "results": [],
    "errors": [],
    "lastUpdated": "ISO8601"
  }
}
```

#### Get Workflow History

Retrieves the execution history of a workflow.

**Request:**
```http
GET /api/workflows/:id/history?limit=10
```

**Response:**
```json
{
  "success": true,
  "history": [
    {
      "timestamp": "ISO8601",
      "version": 5,
      "status": "running"
    }
  ]
}
```

### Memory

#### Get Context Summary

Retrieves a summary of the current memory context.

**Request:**
```http
GET /api/memory/context
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "totalMemories": 150,
    "decisions": 12,
    "errors": 3,
    "lastActivity": "ISO8601"
  }
}
```

#### Search Memories

Searches the memory database for relevant context.

**Request:**
```http
POST /api/memory/search
Content-Type: application/json

{
  "query": "string",
  "limit": 10
}
```

**Response:**
```json
{
  "success": true,
  "memories": [
    {
      "content": "string",
      "metadata": {
        "type": "decision",
        "workflowId": "uuid",
        "timestamp": "ISO8601"
      },
      "distance": 0.23
    }
  ]
}
```

### Examples

#### Code Generation Workflow

Pre-built workflow for AI-assisted code generation.

**Request:**
```http
POST /api/workflows/examples/code-generation
Content-Type: application/json

{
  "requirements": "Create a REST API for user management",
  "language": "typescript"
}
```

**Response:**
```json
{
  "success": true,
  "workflowId": "uuid",
  "message": "Workflow started"
}
```

### Health

#### Health Check

Checks the health of the application and its dependencies.

**Request:**
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "ISO8601",
  "uptime": 12345.67
}
```

## Step Types

### Anthropic

Interact with Claude AI.

```json
{
  "type": "anthropic",
  "params": {
    "message": "Your prompt here",
    "systemPrompt": "Optional system prompt",
    "maxTokens": 4096
  }
}
```

### CodeGen

Generate code from specifications.

```json
{
  "type": "codegen",
  "params": {
    "specification": "API specification",
    "language": "typescript",
    "template": "rest-api",
    "options": {}
  }
}
```

### ClickUp

Create tasks in ClickUp.

```json
{
  "type": "clickup",
  "params": {
    "listId": "list-id",
    "name": "Task name",
    "description": "Task description",
    "priority": 1,
    "assignees": [],
    "tags": []
  }
}
```

### Linear

Create issues in Linear.

```json
{
  "type": "linear",
  "params": {
    "title": "Issue title",
    "description": "Issue description",
    "priority": 2,
    "labels": [],
    "assigneeId": "user-id"
  }
}
```

### n8n

Execute n8n workflows.

```json
{
  "type": "n8n",
  "params": {
    "workflowId": "workflow-id",
    "data": {
      "key": "value"
    }
  }
}
```

### Discord

Send Discord notifications.

```json
{
  "type": "discord",
  "params": {
    "message": "Notification text"
  }
}
```

### Custom

Execute custom functions.

```json
{
  "type": "custom",
  "params": {
    "handler": "async function(integrations) { ... }"
  }
}
```

## Variable Interpolation

Access results from previous steps using template syntax:

```json
{
  "type": "clickup",
  "params": {
    "name": "Review: ${workflow.name}",
    "description": "${steps[0].result.message}"
  }
}
```

## Error Handling

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

HTTP Status Codes:
- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limits

Currently no rate limits. Recommended for production:
- 100 requests per minute per IP
- 1000 requests per hour per API key

## Webhooks (Coming Soon)

Subscribe to workflow events:
- `workflow.started`
- `workflow.completed`
- `workflow.failed`
- `checkpoint.created`

## Examples

### Complete Workflow Example

```bash
# 1. Create workflow
curl -X POST http://localhost:3000/api/workflows \
  -H "Content-Type: application/json" \
  -d '{
    "name": "AI Code Review",
    "description": "Review code with Claude",
    "steps": [
      {
        "name": "Analyze Code",
        "type": "anthropic",
        "params": {
          "message": "Review this code: ...",
          "systemPrompt": "You are a code reviewer"
        }
      },
      {
        "name": "Create Issue",
        "type": "linear",
        "params": {
          "title": "Code Review Results",
          "description": "${steps[0].result.message}"
        }
      }
    ]
  }'

# 2. Execute workflow
curl -X POST http://localhost:3000/api/workflows/WORKFLOW_ID/execute

# 3. Check status
curl http://localhost:3000/api/workflows/WORKFLOW_ID

# 4. Resume if needed
curl -X POST http://localhost:3000/api/workflows/WORKFLOW_ID/resume \
  -H "Content-Type: application/json" \
  -d '{"checkpointId": "CHECKPOINT_ID"}'
```