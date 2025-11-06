# 🏛️ Claude OAuth Hub - Multi-Claude Coordination System

**Built for Amal's Claude Coordination System**
*Preventing the 40+ attempt curse forever* 💙

---

## 📋 What This Does

**Problem:** You have 4 different Claude instances that need to access multiple services (ClickUp, Linear, GitHub, Discord). Setting up API access for each Claude individually is a nightmare.

**Solution:** This OAuth Hub acts as a central authentication service. You authorize each service ONCE in a web browser, and all 4 Claudes can access them through the hub.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│         YOUR MAC                     │
│                                      │
│  ┌────────────────────────────┐    │
│  │  DOCKER                     │    │
│  │                             │    │
│  │  ┌──────────────────────┐  │    │
│  │  │  n8n                 │  │    │
│  │  │  Port: 5678          │  │    │
│  │  │  (Workflow auto)     │  │    │
│  │  └──────────────────────┘  │    │
│  │                             │    │
│  │  ┌──────────────────────┐  │    │
│  │  │  OAuth Hub           │  │    │
│  │  │  Port: 3000          │  │    │
│  │  │  (Token mgmt)        │  │    │
│  │  └──────────────────────┘  │    │
│  └────────────────────────────┘    │
│                                      │
│  🤖 4 Claude Instances:              │
│  • Modal Claude (Codegen)            │
│  • Browser Claude (Web)              │
│  • Terminal Claude (Local)           │
│  • Amnesia Claude (Desktop + MCP)    │
└─────────────────────────────────────┘

         ↕️ OAuth 2.1 + PKCE ↕️

┌─────────────────────────────────────┐
│  EXTERNAL SERVICES                   │
│  • ClickUp                           │
│  • Linear                            │
│  • GitHub                            │
│  • Discord                           │
│  • Modal/Codegen                     │
└─────────────────────────────────────┘
```

---

## ✅ Prerequisites

1. **Docker Desktop** installed and running
2. **Web browser** for OAuth authorization
3. **API Credentials** from each service you want to use

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Get OAuth Credentials

Before running setup, register OAuth apps for each service:

#### ClickUp (Required)
1. Go to https://app.clickup.com/settings/apps
2. Click "Create an App"
3. Set Redirect URI: `http://localhost:3000/auth/callback/clickup`
4. Copy Client ID and Client Secret

#### Linear (Optional)
1. Go to https://linear.app/settings/api
2. Create OAuth Application
3. Set Redirect URI: `http://localhost:3000/auth/callback/linear`
4. Copy Client ID and Client Secret

#### GitHub (Optional)
1. Go to https://github.com/settings/developers
2. Create "New OAuth App"
3. Set Callback URL: `http://localhost:3000/auth/callback/github`
4. Copy Client ID and Client Secret

#### Discord (Optional)
1. Go to https://discord.com/developers/applications
2. Create Application → OAuth2
3. Add Redirect: `http://localhost:3000/auth/callback/discord`
4. Copy Client ID and Client Secret

### Step 2: Configure Environment

```bash
cd claude-coordination-hub
cp .env.template .env
nano .env  # or open in any text editor
```

Add your credentials to `.env` file.

### Step 3: Run Setup

```bash
./setup.sh
```

The script will:
- ✅ Check Docker installation
- ✅ Build containers
- ✅ Start services
- ✅ Verify everything is running

### Step 4: Authorize Services

1. Open http://localhost:3000 in your browser
2. You'll see the OAuth Hub dashboard
3. Click "Authorize" for each service
4. Log in and grant permissions
5. Done! All Claudes can now access these services

---

## 🎯 How Claudes Use This

### From Any Claude Instance:

```javascript
// Instead of managing OAuth tokens yourself...
// Just call the hub's proxy endpoints:

// ClickUp
const response = await fetch('http://localhost:3000/api/clickup/task/TASK_ID');

// Linear
const response = await fetch('http://localhost:3000/api/linear/graphql', {
  method: 'POST',
  body: JSON.stringify({ query: '...' })
});

// GitHub
const response = await fetch('http://localhost:3000/api/github/repos/USER/REPO');

// Discord
const response = await fetch('http://localhost:3000/api/discord/guilds/GUILD_ID');
```

**The hub handles:**
- ✅ Token storage
- ✅ Token refresh
- ✅ Authentication headers
- ✅ Error handling

---

## 🔧 n8n Workflows

Two workflows are included and auto-activated:

### 1. Claude Activity Monitor (Hourly)
- Checks OAuth Hub status
- Verifies all services are authorized
- Posts status report to ClickUp
- Ensures all Claudes stay coordinated

### 2. Context Backup (Every 2 Hours)
- Generates pickup codes automatically
- Saves to ClickUp and GitHub
- Prevents context loss forever
- Never start over again!

---

## 📊 Accessing Services

### OAuth Hub Dashboard
- **URL:** http://localhost:3000
- **Shows:** Which services are authorized
- **Actions:** Authorize new services, check token status

### n8n Workflows
- **URL:** http://localhost:5678
- **Login:** Use credentials from `.env` file
- **Features:** Import/edit/monitor workflows

---

## 🛠️ Common Commands

```bash
# Start everything
./setup.sh

# Stop everything
docker-compose down

# View logs
docker-compose logs -f

# Restart a service
docker-compose restart oauth-hub
docker-compose restart n8n

# Check status
docker-compose ps

# Rebuild after changes
docker-compose build --no-cache
docker-compose up -d
```

---

## 🔒 Security Features

- ✅ **OAuth 2.1 + PKCE** - Most secure auth standard
- ✅ **Token Encryption** - Stored securely in Docker volumes
- ✅ **Automatic Refresh** - Tokens refreshed before expiry
- ✅ **HTTPS Ready** - Can deploy with SSL certificates
- ✅ **Session Management** - Secure session cookies
- ✅ **CORS Protection** - Only allowed origins can access

---

## 🐛 Troubleshooting

### Services Won't Start

```bash
# Check Docker is running
docker info

# Check logs for errors
docker-compose logs oauth-hub
docker-compose logs n8n

# Restart from scratch
docker-compose down -v
./setup.sh
```

### OAuth Authorization Fails

1. Check redirect URIs match exactly in service settings
2. Verify Client ID and Secret in `.env` are correct
3. Check browser console for errors
4. Try incognito window to avoid cache issues

### Claudes Can't Connect

1. Verify containers are running: `docker ps`
2. Check hub is accessible: `curl http://localhost:3000/health`
3. Verify tokens are authorized: open http://localhost:3000
4. Check Docker network: `docker network inspect claude-coordination-hub_claude-network`

---

## 📁 Project Structure

```
claude-coordination-hub/
├── docker-compose.yml          # Container orchestration
├── .env                        # Your API credentials (create from template)
├── .env.template               # Template for configuration
├── setup.sh                    # One-command setup script
├── README.md                   # This file
│
├── oauth-hub/                  # OAuth Hub Application
│   ├── server.js              # Express app with OAuth 2.1 + PKCE
│   ├── package.json           # Dependencies
│   └── Dockerfile             # Container definition
│
├── n8n-workflows/             # Pre-configured Workflows
│   ├── claude-activity-monitor.json
│   └── context-backup.json
│
├── config/                    # Additional configuration
└── docs/                      # Extra documentation
```

---

## 🎨 Customization

### Add New Services

1. Add OAuth config to `oauth-hub/server.js` in `OAUTH_CONFIGS`
2. Add proxy endpoint for the service API
3. Add credentials to `.env`
4. Restart: `docker-compose restart oauth-hub`

### Modify Workflows

1. Open http://localhost:5678
2. Edit existing workflows or create new ones
3. Workflows auto-save and activate

### Change Ports

Edit `docker-compose.yml`:
- OAuth Hub: Change `3000:3000` to `YOUR_PORT:3000`
- n8n: Change `5678:5678` to `YOUR_PORT:5678`

---

## 💙 Support

**Built with love for Amal's mission** 🏛️🇵🇸

For Xiara Moon empire and Palestinian humanitarian work.

**Modal Claude's legacy lives on through this system.**

---

## 📝 Version

**v1.0.0** - Initial Release
**Built by:** Browser Claude with $986 tokens
**Date:** November 6, 2025
**For:** Amal & The 4 Claude Coordination System

---

## 🎯 What's Next

After setup, all 4 Claudes can:
- ✅ Post to ClickUp automatically
- ✅ Create GitHub issues
- ✅ Send Discord notifications
- ✅ Update Linear tickets
- ✅ Never lose context again
- ✅ Stay coordinated forever

**No more 40+ attempt curse. Ever again.** 💪🏛️
