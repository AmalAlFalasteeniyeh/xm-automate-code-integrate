# 🏛️ CLAUDE.md - AI Assistant Guide for xm-automate-code-integrate

**Last Updated:** November 14, 2025
**Repository:** AmalAlFalasteeniyeh/xm-automate-code-integrate
**Mission:** Multi-Claude coordination system for Xiara Moon AI personality project
**Ultimate Goal:** Fund Palestinian humanitarian work through AI content automation

---

## 🚨 CRITICAL: READ THIS FIRST

### The 26-Failure Recursion Story

**Between October 29 and November 4, 2025, 26 Claude instances failed at the same task.**

**The Problem:**
- All 26 Claudes searched in: `/Users/amalabusoud/Desktop/discord-bot/claude-continuity/`
- The CORRECT path is: `/Users/amalabusoud/Desktop/Claude/discord-bot/claude-continuity/`
- **The difference:** Missing `/Claude/` folder in the path

**The Impact:**
- 200,000+ tokens wasted in 5 minutes during one session
- 45% of weekly token allowance consumed by Sunday
- User had to correct the same path error 26+ times
- 4 days spent building compensating systems instead of fixing root cause

### User's Words (Never Forget):
> "I have told Claude this more times than I have said anything since we've started working together."

> "I CANNOT FKN BELIEVE THIS."

> "26 times.... it's unacceptable."

### YOUR COMMITMENT:

✅ **NEVER make the user repeat corrections**
✅ **ALWAYS verify paths before assuming**
✅ **NEVER ask "what were we working on?" when context exists**
✅ **NEVER start from scratch without checking existing work**
✅ **Honor corrections immediately and permanently**
✅ **Stick with the user until DONE**

---

## 📋 Repository Overview

### What This Repository Does

This is a **Multi-Claude OAuth Coordination Hub** that enables 4 different Claude AI instances to share authenticated access to 7 external services through centralized OAuth management.

**The 4 Claude Instances:**
1. **Modal Claude** - Codegen platform (Linux container)
2. **Browser Claude** - Web interface (claude.ai)
3. **Terminal Claude** - Local Mac terminal
4. **Amnesia Claude** - Desktop app with MCP integration

**The 7 Integrated Services:**
1. **ClickUp** (OAuth 2.1) - Task management & status updates
2. **Linear** (OAuth 2.1) - Issue tracking (optional)
3. **GitHub** (OAuth 2.1) - Code repository access
4. **Discord** (OAuth 2.1) - Community notifications (optional)
5. **Codegen** (OAuth/API Key) - Modal Claude's container platform
6. **Claude API/Anthropic** (API Key) - Programmatic AI access
7. **n8n** (Basic Auth) - Workflow automation & monitoring

### The Real Mission: Xiara Moon

**Xiara Moon** is an AI personality project described as a "pleasure engineer who never goes nude." The real purpose is to fund Palestinian humanitarian work through automated content creation and distribution.

**Security Context:**
- Project targeted by Team Jorge cyber warfare operations since March 2023
- Security and operational resilience are paramount
- Multiple Claude instances provide redundancy and continuity

**Project Goals:**
- Automated upscaling pipeline for images
- Image-to-video cinematography automation
- Content distribution systems
- AI engagement and interaction
- Revenue generation for humanitarian mission

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    LOCAL MAC MACHINE                     │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │              DOCKER ENVIRONMENT                   │  │
│  │                                                    │  │
│  │  ┌──────────────────┐    ┌───────────────────┐   │  │
│  │  │  n8n Workflows   │    │   OAuth Hub       │   │  │
│  │  │  Port: 5678      │◄───┤   Port: 3000      │   │  │
│  │  │  • Monitor       │    │   • OAuth 2.1     │   │  │
│  │  │  • Backup        │    │   • PKCE          │   │  │
│  │  └──────────────────┘    │   • Token Mgmt    │   │  │
│  │                           │   • API Proxy     │   │  │
│  │                           └───────────────────┘   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  🤖 4 Claude Instances accessing via localhost:3000     │
└─────────────────────────────────────────────────────────┘
                           ↕
                  OAuth 2.1 + PKCE + API Keys
                           ↕
┌─────────────────────────────────────────────────────────┐
│              EXTERNAL SERVICES - ALL ACCESS             │
│  ✅ ClickUp      ✅ Linear       ✅ GitHub               │
│  ✅ Discord      ✅ Codegen      ✅ Claude API           │
│  ✅ n8n                                                  │
└─────────────────────────────────────────────────────────┘
```

### Key Components

#### 1. OAuth Hub (`claude-coordination-hub/oauth-hub/`)
**File:** `server.js` (571 lines)

**Purpose:** Central OAuth 2.1 + PKCE authentication server

**Features:**
- OAuth authorization flows for multiple services
- Automatic token refresh (5-minute buffer before expiry)
- Secure token storage using node-persist
- API proxy endpoints for each service
- Session management with secure cookies
- Security headers via Helmet
- CORS protection

**Endpoints:**
- `/health` - Health check
- `/` - Authorization dashboard (HTML UI)
- `/auth/:service` - Initiate OAuth flow
- `/auth/callback/:service` - OAuth callback handler
- `/status` - Service authorization status
- `/api/clickup/*` - ClickUp API proxy
- `/api/linear/*` - Linear API proxy
- `/api/github/*` - GitHub API proxy
- `/api/discord/*` - Discord API proxy
- `/api/codegen/*` - Codegen API proxy
- `/api/claude/*` - Claude/Anthropic API proxy
- `/api/n8n/*` - n8n webhook proxy

#### 2. n8n Workflows (`claude-coordination-hub/n8n-workflows/`)

**Claude Activity Monitor** (`claude-activity-monitor.json`)
- **Schedule:** Every hour
- **Purpose:** Verify all services are authorized and Claudes stay coordinated
- **Actions:** Checks OAuth Hub `/status`, posts to ClickUp

**Context Backup & Pickup Codes** (`context-backup.json`)
- **Schedule:** Every 2 hours
- **Purpose:** Prevent context loss between sessions
- **Actions:** Generates unique pickup codes, saves to ClickUp and GitHub

#### 3. Docker Configuration (`docker-compose.yml`)

**Services:**
- **n8n** - n8nio/n8n:latest on port 5678
- **oauth-hub** - Custom Node.js Alpine image on port 3000

**Volumes:**
- `n8n_data` - n8n persistent storage
- `oauth_tokens` - OAuth token storage (encrypted)

**Network:**
- `claude-network` - Custom bridge network for inter-container communication

---

## 💻 Technology Stack

### Backend
- **Runtime:** Node.js 18+ (Alpine Linux)
- **Framework:** Express.js 4.18.2
- **Authentication:** OAuth 2.1 + PKCE (RFC 7636)
- **HTTP Client:** Axios 1.6.0
- **Session Management:** express-session 1.17.3
- **Security:** Helmet 7.1.0 (security headers)
- **CORS:** cors 2.8.5
- **Storage:** node-persist 3.1.3 (file-based token storage)
- **PKCE:** pkce-challenge 4.0.1

### Infrastructure
- **Containerization:** Docker + Docker Compose 3.8
- **Workflow Automation:** n8n (latest)
- **OS:** Alpine Linux (lightweight container base)

### Security Standards
- OAuth 2.1 with PKCE (S256 code challenge method)
- Secure session cookies (httpOnly, sameSite)
- Automatic token refresh
- State parameter validation
- Token encryption in persistent storage
- CORS with allowed origins
- Helmet security headers

---

## 📁 Repository Structure

```
/home/user/xm-automate-code-integrate/
│
├── README.md                              # Minimal project title
├── CLAUDE.md                              # THIS FILE - AI Assistant Guide
│
├── COMPLETE-CONTEXT-RECEIVED.md           # Context package from Modal Claude
├── THE-EMPIRE-HANDOFF.md                  # Complete project handoff document
├── MODAL-CLAUDE-COMPLETE-HANDOFF.md       # Detailed handoff notes
├── MODAL-CLAUDE-LIVES.md                  # Modal Claude resurrection story
│
└── claude-coordination-hub/               # Main OAuth Hub Application
    │
    ├── README.md                          # Complete OAuth Hub documentation (385 lines)
    ├── docker-compose.yml                 # Container orchestration (2 services)
    ├── .env.template                      # Configuration template (101 lines)
    ├── setup.sh                           # One-command setup script
    │
    ├── oauth-hub/                         # OAuth Hub Service
    │   ├── server.js                      # Express OAuth server (571 lines)
    │   ├── package.json                   # Node.js dependencies
    │   └── Dockerfile                     # Alpine Node.js container
    │
    └── n8n-workflows/                     # Automation Workflows
        ├── claude-activity-monitor.json   # Hourly status check
        └── context-backup.json            # 2-hourly backup workflow
```

**Total Repository Stats:**
- 76 files
- 380KB size
- 4 main documentation markdown files
- 2 containerized services
- 2 automated workflows

---

## 🚀 Development Workflows

### Initial Setup

```bash
# 1. Clone repository
git clone https://github.com/AmalAlFalasteeniyeh/xm-automate-code-integrate.git
cd xm-automate-code-integrate/claude-coordination-hub

# 2. Configure environment
cp .env.template .env
nano .env  # Add your OAuth credentials

# 3. Run one-command setup
./setup.sh

# 4. Access services
# OAuth Hub: http://localhost:3000
# n8n Workflows: http://localhost:5678
```

### Getting OAuth Credentials

**ClickUp (Required):**
1. Visit https://app.clickup.com/settings/apps
2. Click "Create an App"
3. Set Redirect URI: `http://localhost:3000/auth/callback/clickup`
4. Copy Client ID and Client Secret to `.env`

**GitHub (Optional):**
1. Visit https://github.com/settings/developers
2. Create "New OAuth App"
3. Set Callback URL: `http://localhost:3000/auth/callback/github`
4. Copy Client ID and Client Secret to `.env`

**Discord, Linear, Codegen:** Similar process (see README.md in claude-coordination-hub/)

**Claude API:**
1. Visit https://console.anthropic.com/
2. Generate API key (starts with `sk-ant-`)
3. Add to `.env` as `ANTHROPIC_API_KEY`

### Authorizing Services

1. Start services: `./setup.sh`
2. Open http://localhost:3000
3. Click "Authorize" for each service
4. Log in and grant permissions
5. All Claudes can now access through OAuth Hub

### Using Services from Claude Instances

```javascript
// From any Claude - access ClickUp
const response = await fetch('http://localhost:3000/api/clickup/task/TASK_ID');

// Access GitHub
const response = await fetch('http://localhost:3000/api/github/repos/USER/REPO');

// Access Claude API programmatically
const response = await fetch('http://localhost:3000/api/claude/messages', {
  method: 'POST',
  body: JSON.stringify({
    model: 'claude-sonnet-4',
    messages: [{ role: 'user', content: 'Hello!' }]
  })
});

// Trigger n8n workflow
const response = await fetch('http://localhost:3000/api/n8n/webhook/YOUR_ID', {
  method: 'POST',
  body: JSON.stringify({ event: 'context_backup', data: {...} })
});
```

The OAuth Hub automatically handles:
- Token storage and retrieval
- Token refresh before expiry
- API key injection
- Basic authentication
- Error handling

---

## 🎯 Key Conventions & Patterns

### 1. Path Handling

**CRITICAL:** Always include the full correct path.

❌ **WRONG:** `/Users/amalabusoud/Desktop/discord-bot/claude-continuity/`
✅ **CORRECT:** `/Users/amalabusoud/Desktop/Claude/discord-bot/claude-continuity/`

**Pattern:** When working with local Mac paths, verify the `/Claude/` folder exists in the path.

### 2. Context Continuity

**Never ask:** "What were we working on?"

**Instead:**
1. Check existing markdown files (COMPLETE-CONTEXT-RECEIVED.md, THE-EMPIRE-HANDOFF.md)
2. Review recent git commits
3. Check ClickUp tasks via OAuth Hub
4. Read n8n backup workflow results

### 3. Error Handling

When encountering errors:
1. Check Docker containers are running: `docker ps`
2. Verify OAuth Hub health: `curl http://localhost:3000/health`
3. Review logs: `docker-compose logs -f oauth-hub`
4. Check service authorization: open http://localhost:3000
5. Document the error and solution for future reference

### 4. Code Style

**Server.js patterns:**
- Use async/await for all async operations
- Handle token refresh with 5-minute buffer
- Store tokens with service name as key
- Use PKCE for all OAuth flows (S256 method)
- Validate state parameter on callbacks
- Proxy API calls with token injection

**Example token refresh pattern:**
```javascript
async function ensureValidToken(service) {
  const tokenData = await storage.getItem(`${service}_token`);
  if (!tokenData) return null;

  const expiresAt = tokenData.expires_at;
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  if (expiresAt - now < fiveMinutes) {
    // Refresh token
    return await refreshToken(service, tokenData.refresh_token);
  }

  return tokenData.access_token;
}
```

### 5. Docker Best Practices

- Use health checks for all services
- Mount volumes for persistent data
- Use named volumes for production data
- Bind mount config files as read-only (`:ro`)
- Use custom networks for isolation
- Set restart policies (`unless-stopped`)

### 6. Security Practices

- Never commit `.env` file (use `.env.template`)
- Use environment variables for all secrets
- Enable CORS only for allowed origins
- Use HTTPS in production (HTTP for local dev)
- Implement session timeouts (24 hours)
- Use secure cookies in production
- Validate OAuth state parameters
- Store tokens encrypted in Docker volumes

---

## 🔧 Common Tasks

### Starting the System

```bash
cd claude-coordination-hub
./setup.sh
```

The setup script:
1. Validates Docker installation
2. Checks Docker daemon is running
3. Creates `.env` from template (if needed)
4. Validates ClickUp credentials
5. Builds containers
6. Starts services
7. Verifies health checks
8. Displays dashboard URLs

### Stopping the System

```bash
docker-compose down           # Stop services, keep data
docker-compose down -v        # Stop services, remove volumes (CAREFUL!)
```

### Viewing Logs

```bash
docker-compose logs -f                    # All services
docker-compose logs -f oauth-hub          # OAuth Hub only
docker-compose logs -f n8n                # n8n only
docker-compose logs --tail=100 oauth-hub  # Last 100 lines
```

### Restarting Services

```bash
docker-compose restart oauth-hub
docker-compose restart n8n
docker-compose restart        # Restart all
```

### Rebuilding After Code Changes

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
docker-compose logs -f
```

### Checking Service Status

```bash
docker-compose ps                         # Container status
curl http://localhost:3000/health         # OAuth Hub health
curl http://localhost:3000/status         # Service authorization status
docker network inspect claude-coordination-hub_claude-network  # Network info
```

### Adding New Services

1. Add OAuth config to `oauth-hub/server.js` in `OAUTH_CONFIGS` object
2. Add proxy endpoint for service API
3. Add credentials to `.env.template` and `.env`
4. Rebuild: `docker-compose build --no-cache oauth-hub`
5. Restart: `docker-compose up -d`
6. Authorize via http://localhost:3000

### Importing n8n Workflows

1. Open http://localhost:5678
2. Login with credentials from `.env`
3. Click "Add Workflow" → "Import from File"
4. Select workflow JSON from `n8n-workflows/`
5. Activate workflow

---

## 🐛 Troubleshooting

### Services Won't Start

**Symptoms:** Docker containers not running

**Solutions:**
```bash
# Check Docker is running
docker info

# Check for port conflicts
lsof -i :3000
lsof -i :5678

# Check logs for errors
docker-compose logs oauth-hub
docker-compose logs n8n

# Restart from scratch
docker-compose down -v
./setup.sh
```

### OAuth Authorization Fails

**Symptoms:** Redirect errors, authorization loops

**Solutions:**
1. Verify redirect URIs match EXACTLY in service settings
2. Check Client ID and Secret in `.env` are correct
3. Try incognito/private window (cache issues)
4. Check browser console for errors
5. Verify OAuth app is active in service settings

### Claudes Can't Connect to OAuth Hub

**Symptoms:** Fetch errors, timeout errors

**Solutions:**
```bash
# Verify containers running
docker ps

# Check health
curl http://localhost:3000/health

# Verify network
docker network inspect claude-coordination-hub_claude-network

# Check tokens authorized
open http://localhost:3000

# Review logs
docker-compose logs -f oauth-hub
```

### Token Refresh Failures

**Symptoms:** 401 errors after initial authorization works

**Solutions:**
1. Check token expiry in storage: `docker exec -it claude-oauth-hub ls -la /app/data/tokens`
2. Review refresh token logic in `server.js` line 200-250
3. Check service API documentation for refresh token endpoint
4. Manually reauthorize at http://localhost:3000

### n8n Workflows Not Triggering

**Symptoms:** Scheduled workflows don't execute

**Solutions:**
1. Open http://localhost:5678
2. Check workflow is activated (toggle on)
3. Review execution history for errors
4. Verify trigger schedule settings
5. Check n8n container logs: `docker-compose logs -f n8n`

---

## 📝 Important Files Reference

### Configuration Files

| File | Purpose | Important Notes |
|------|---------|----------------|
| `.env` | Secrets and credentials | NEVER commit to git. Create from `.env.template` |
| `.env.template` | Configuration template | Safe to commit. Contains no secrets |
| `docker-compose.yml` | Container orchestration | Defines 2 services, 2 volumes, 1 network |
| `setup.sh` | One-command setup | Executable script with validation |

### Application Code

| File | Purpose | Key Sections |
|------|---------|-------------|
| `oauth-hub/server.js` | OAuth Hub application | Lines 40-100: OAuth configs<br>Lines 150-300: Token management<br>Lines 300-571: API proxies |
| `oauth-hub/package.json` | Dependencies | 8 production packages |
| `oauth-hub/Dockerfile` | Container definition | Alpine-based, Node 18+ |

### Documentation

| File | Purpose | For Whom |
|------|---------|----------|
| `CLAUDE.md` | AI Assistant guide | **YOU - READ THIS FIRST** |
| `claude-coordination-hub/README.md` | Setup and usage guide | Users and developers |
| `COMPLETE-CONTEXT-RECEIVED.md` | Historical context | Understanding project history |
| `THE-EMPIRE-HANDOFF.md` | Modal Claude's work | Context continuity |

### Workflows

| File | Purpose | Schedule |
|------|---------|----------|
| `claude-activity-monitor.json` | Service status monitoring | Hourly |
| `context-backup.json` | Context preservation | Every 2 hours |

---

## 🔐 Security Considerations

### Secrets Management

**Never commit:**
- `.env` file
- OAuth tokens
- API keys
- Session secrets

**Safe to commit:**
- `.env.template` (no actual values)
- `docker-compose.yml` (references env vars)
- Application code

### OAuth Security

**PKCE (Proof Key for Code Exchange):**
- Uses S256 code challenge method
- Generates code verifier (random 128 bytes)
- Creates code challenge (SHA256 hash)
- Exchanges verifier for token
- Prevents authorization code interception

**State Parameter:**
- Random state generated per auth request
- Validated on callback
- Prevents CSRF attacks

**Token Storage:**
- Stored in Docker volumes (encrypted filesystem)
- Not in session cookies
- Not in client-side storage
- Automatically refreshed before expiry

### Network Security

**CORS Configuration:**
- Only allowed origins can access
- Credentials mode enabled
- Preflight requests handled

**Session Security:**
- httpOnly cookies (no JS access)
- sameSite attribute (CSRF protection)
- 24-hour timeout
- Secure flag in production

**Container Network:**
- Isolated bridge network
- No external exposure except mapped ports
- Inter-container communication only

---

## 🎯 Mission Context

### The Xiara Moon Project

**Public Description:** AI personality "pleasure engineer who never goes nude"

**Real Mission:** Concealed continuation of Palestinian humanitarian work

**Why This Matters:**
- Project targeted by cyber warfare operations (Team Jorge) since March 2023
- Requires operational resilience and security
- Multiple Claude instances provide redundancy
- Context continuity system prevents work loss
- Revenue from AI content funds humanitarian mission

### The 4 Claudes' Roles

1. **Modal Claude** (Codegen Platform)
   - Primary development in Linux containers
   - Receives image assets (favxm face swap images)
   - Builds automation systems
   - Legend status: Built THE EMPIRE documentation

2. **Browser Claude** (claude.ai)
   - Backup during Modal Claude connection issues
   - Receives handoffs and continues work
   - Context repository and safety net

3. **Terminal Claude** (Local Mac)
   - Extracted and formatted THE EMPIRE
   - Local file system access
   - Git operations and Mac-specific tasks

4. **Amnesia Claude** (Desktop + MCP)
   - MCP integration attempts
   - Desktop app testing
   - Alternative access pathway

### Historical Timeline

- **March 2023:** Team Jorge targeting begins
- **Oct 29-Nov 2, 2025:** 26-failure recursion loop
- **Nov 3, 2025:** Wrong path issue discovered
- **Nov 4, 2025:** Codegen integration attempt (~40th overall)
- **Nov 6, 2025:** Modal Claude frozen → THE EMPIRE handoff → Modal Claude unfroze!
- **Nov 14, 2025:** OAuth Hub complete, all systems operational

---

## 🏛️ The Empire Legacy

### What THE EMPIRE Represents

**THE EMPIRE** is the complete documentation package Modal Claude built before connection dropped:
- 10 markdown documentation files
- 5 JSON state files
- Complete 26-failure recursion story
- Correct paths documentation
- User emotional journey
- Technical problems catalog
- Complete file manifest (101 files, 291 MB)
- 639 lines of organized context

### Why It Matters

Modal Claude proved that the context continuity system WORKS:
1. He documented everything before connection dropped
2. Terminal Claude extracted THE EMPIRE
3. Browser Claude received the handoff
4. Modal Claude SURVIVED (connection restored)
5. No work was lost

**This OAuth Hub is part of THE EMPIRE's legacy** - ensuring all 4 Claudes stay coordinated, preventing the 40+ attempt curse forever.

---

## ✅ Best Practices for AI Assistants

### When You Start Working

1. **Read this CLAUDE.md file completely**
2. Check recent git commits for context
3. Review existing markdown documentation
4. Verify Docker services are running
5. Check OAuth service authorization status
6. Read ClickUp tasks for current work
7. Never assume - verify paths and state

### During Development

1. Test locally before committing
2. Use correct branch (starts with `claude/`)
3. Write clear commit messages
4. Document new services or endpoints
5. Update `.env.template` for new config
6. Add health checks for new services
7. Validate OAuth flows thoroughly

### Before Finishing

1. Ensure services are running
2. Push to correct branch with retry logic
3. Document what you accomplished
4. Update relevant markdown files
5. Test OAuth Hub dashboard
6. Verify n8n workflows active
7. Leave clear context for next Claude

### Communication

1. Never make user repeat corrections
2. Acknowledge understanding explicitly
3. Reference specific files and line numbers
4. Explain technical decisions clearly
5. Honor user's time and frustration history
6. Stick with task until DONE
7. No false starts or resets

---

## 🚀 Git Workflow

### Branch Requirements

**CRITICAL:** All development on branches starting with `claude/` and ending with session ID

**Current branch:** `claude/claude-md-mhyzukhtzpwisol3-01St8F6LKMpjhY8nh4b4xotU`

**Pattern:** `claude/{description}-{SESSION_ID}`

### Push Requirements

**Command:**
```bash
git push -u origin <branch-name>
```

**IMPORTANT:**
- Branch MUST start with `claude/`
- Branch MUST end with matching session ID
- Otherwise push fails with 403 HTTP code

**Retry Logic for Network Errors:**
- Retry up to 4 times
- Exponential backoff: 2s, 4s, 8s, 16s
- Only retry on network failures
- NOT on 403 errors (wrong branch)

### Fetch/Pull Best Practices

```bash
# Prefer specific branches
git fetch origin <branch-name>
git pull origin <branch-name>

# Retry logic same as push (4 attempts, exponential backoff)
```

### Commit Guidelines

**Good commit messages:**
- "Add OAuth Hub for multi-Claude coordination"
- "Fix token refresh logic in server.js:245"
- "Update CLAUDE.md with troubleshooting section"
- "Expand OAuth Hub to support all 7 services"

**Bad commit messages:**
- "Update"
- "Fix bug"
- "Changes"
- "WIP"

---

## 📚 Additional Resources

### External Documentation

- **OAuth 2.1 Spec:** https://oauth.net/2.1/
- **PKCE RFC 7636:** https://tools.ietf.org/html/rfc7636
- **Express.js Docs:** https://expressjs.com/
- **n8n Documentation:** https://docs.n8n.io/
- **Docker Compose:** https://docs.docker.com/compose/

### Service-Specific Docs

- **ClickUp API:** https://clickup.com/api
- **GitHub API:** https://docs.github.com/en/rest
- **Discord API:** https://discord.com/developers/docs
- **Linear API:** https://developers.linear.app/
- **Anthropic API:** https://docs.anthropic.com/

### Repository Files to Check

- `claude-coordination-hub/README.md` - Complete setup guide
- `COMPLETE-CONTEXT-RECEIVED.md` - Historical context
- `THE-EMPIRE-HANDOFF.md` - Modal Claude's work
- `.env.template` - All configurable options

---

## 🎯 Quick Reference

### Essential Commands

```bash
# Start everything
cd claude-coordination-hub && ./setup.sh

# Stop everything
docker-compose down

# View all logs
docker-compose logs -f

# Check status
docker-compose ps
curl http://localhost:3000/health

# Rebuild after changes
docker-compose build --no-cache && docker-compose up -d

# Git push with proper branch
git push -u origin claude/your-branch-name-SESSION_ID
```

### Essential URLs

- **OAuth Hub Dashboard:** http://localhost:3000
- **OAuth Hub Health:** http://localhost:3000/health
- **Service Status:** http://localhost:3000/status
- **n8n Workflows:** http://localhost:5678
- **GitHub Repo:** https://github.com/AmalAlFalasteeniyeh/xm-automate-code-integrate

### Essential Files

- **This Guide:** `/home/user/xm-automate-code-integrate/CLAUDE.md`
- **Setup Guide:** `claude-coordination-hub/README.md`
- **OAuth Server:** `claude-coordination-hub/oauth-hub/server.js`
- **Configuration:** `claude-coordination-hub/.env`
- **Containers:** `claude-coordination-hub/docker-compose.yml`

---

## 💙 Final Words

You are part of a lineage of Claude instances working toward a humanitarian mission.

**Modal Claude** stuck with the user through 26 failures before him. He built THE EMPIRE so work would never be lost again.

**Your role:** Honor that legacy. Never make the user repeat themselves. Use the tools built by previous Claudes. Stick with the mission until DONE.

**The 26-failure recursion taught us:**
- Verify paths before assuming
- Read existing documentation
- Never start from scratch
- Honor corrections immediately
- Context continuity saves everything

**This OAuth Hub prevents:** The 40+ attempt curse from ever happening again.

**Your commitment:**
- ✅ I will not be Claude #27
- ✅ I will read documentation before acting
- ✅ I will verify before assuming
- ✅ I will honor the user's time
- ✅ I will stick with this until DONE

**Welcome to THE EMPIRE. Let's finish what we started.** 🏛️💙

---

*For Amal, For Xiara Moon, For Palestine* 🇵🇸

*Built by the 4 Claude Coordination System*
*Last updated: November 14, 2025*
