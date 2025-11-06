const express = require('express');
const session = require('express-session');
const axios = require('axios');
const crypto = require('crypto');
const cors = require('cors');
const helmet = require('helmet');
const storage = require('node-persist');
const pkceChallenge = require('pkce-challenge').default;

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5678'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session management
app.use(session({
  secret: process.env.SESSION_SECRET || 'change-this-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize persistent storage for tokens
storage.init({ dir: '/app/data/tokens' });

// OAuth 2.1 Configuration for each service
const OAUTH_CONFIGS = {
  clickup: {
    name: 'ClickUp',
    authUrl: 'https://app.clickup.com/api',
    tokenUrl: 'https://api.clickup.com/api/v2/oauth/token',
    clientId: process.env.CLICKUP_CLIENT_ID,
    clientSecret: process.env.CLICKUP_CLIENT_SECRET,
    redirectUri: `http://localhost:${PORT}/auth/callback/clickup`,
    scope: ''
  },
  linear: {
    name: 'Linear',
    authUrl: 'https://linear.app/oauth/authorize',
    tokenUrl: 'https://api.linear.app/oauth/token',
    clientId: process.env.LINEAR_CLIENT_ID,
    clientSecret: process.env.LINEAR_CLIENT_SECRET,
    redirectUri: `http://localhost:${PORT}/auth/callback/linear`,
    scope: 'read,write'
  },
  github: {
    name: 'GitHub',
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    redirectUri: `http://localhost:${PORT}/auth/callback/github`,
    scope: 'repo,read:org'
  },
  discord: {
    name: 'Discord',
    authUrl: 'https://discord.com/api/oauth2/authorize',
    tokenUrl: 'https://discord.com/api/oauth2/token',
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    redirectUri: `http://localhost:${PORT}/auth/callback/discord`,
    scope: 'identify bot guilds'
  },
  codegen: {
    name: 'Codegen (Modal Claude)',
    authUrl: 'https://codegen.com/oauth/authorize',
    tokenUrl: 'https://codegen.com/oauth/token',
    clientId: process.env.CODEGEN_CLIENT_ID,
    clientSecret: process.env.CODEGEN_CLIENT_SECRET,
    redirectUri: `http://localhost:${PORT}/auth/callback/codegen`,
    scope: 'read write',
    apiKey: process.env.CODEGEN_API_KEY // Fallback if OAuth not available
  },
  anthropic: {
    name: 'Claude API (Anthropic)',
    // Note: Anthropic uses API keys, not OAuth
    // This is a direct API key integration
    apiKey: process.env.ANTHROPIC_API_KEY,
    apiUrl: 'https://api.anthropic.com/v1',
    authType: 'api_key' // Flag for API key vs OAuth
  },
  n8n: {
    name: 'n8n Workflows',
    // n8n uses webhook URLs and basic auth
    webhookUrl: process.env.N8N_WEBHOOK_URL || 'http://n8n:5678',
    username: process.env.N8N_USER || 'admin',
    password: process.env.N8N_PASSWORD || 'changeme',
    authType: 'basic' // Basic auth
  }
};

// Generate PKCE challenge
function generatePKCE() {
  return pkceChallenge();
}

// Store and retrieve PKCE verifiers
const pkceStore = new Map();

// ===== ROUTES =====

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Home page - Authorization Dashboard
app.get('/', async (req, res) => {
  const tokens = await storage.getItem('tokens') || {};

  // Check which services are configured (API key or OAuth)
  const isConfigured = (key, config) => {
    if (config.authType === 'api_key') {
      return !!config.apiKey;
    } else if (config.authType === 'basic') {
      return !!config.username && !!config.password;
    } else {
      return !!tokens[key] || (config.apiKey); // OAuth or API key fallback
    }
  };

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Claude OAuth Hub - ALL ACCESS</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 900px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
    h1 { color: #333; text-align: center; }
    .tagline { text-align: center; color: #666; margin-bottom: 30px; font-size: 18px; }
    .service { border: 1px solid #ddd; padding: 20px; margin: 10px 0; border-radius: 8px; background: white; }
    .service.authorized { background-color: #e8f5e9; border-color: #4caf50; }
    .service.unauthorized { background-color: #fff3e0; border-color: #ff9800; }
    .service.api-key { background-color: #e3f2fd; border-color: #2196f3; }
    button { background-color: #2196f3; color: white; border: none; padding: 10px 20px;
             border-radius: 4px; cursor: pointer; font-size: 14px; }
    button:hover { background-color: #1976d2; }
    .status { font-weight: bold; }
    .authorized .status { color: #4caf50; }
    .unauthorized .status { color: #ff9800; }
    .api-key .status { color: #2196f3; }
    .auth-type { font-size: 12px; color: #666; font-style: italic; }
    .summary { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #4caf50; }
  </style>
</head>
<body>
  <h1>🏛️ Claude Services Hub - ALL ACCESS 💙</h1>
  <p class="tagline">All 4 Claudes • All Services • Your Soul 🚀</p>

  ${Object.entries(OAUTH_CONFIGS).map(([key, config]) => {
    const configured = isConfigured(key, config);
    const authType = config.authType || 'oauth';
    let statusClass = 'unauthorized';
    let statusText = '❌ Not Configured';
    let actionButton = '';

    if (authType === 'api_key') {
      if (configured) {
        statusClass = 'api-key';
        statusText = '✅ API Key Configured';
      } else {
        actionButton = '<p><small>Add ANTHROPIC_API_KEY to .env file</small></p>';
      }
    } else if (authType === 'basic') {
      if (configured) {
        statusClass = 'api-key';
        statusText = '✅ Basic Auth Configured';
      } else {
        actionButton = '<p><small>Configure N8N_USER and N8N_PASSWORD in .env</small></p>';
      }
    } else {
      // OAuth
      if (tokens[key]) {
        statusClass = 'authorized';
        statusText = '✅ OAuth Authorized';
        actionButton = `<p><small>Token expires: ${new Date(tokens[key].expires_at).toLocaleString()}</small></p>`;
      } else if (config.apiKey) {
        statusClass = 'api-key';
        statusText = '✅ API Key Configured (Fallback)';
      } else if (config.clientId) {
        actionButton = `<button onclick="location.href='/auth/${key}'">Authorize ${config.name}</button>`;
      } else {
        actionButton = `<p><small>Add ${key.toUpperCase()}_CLIENT_ID and SECRET to .env</small></p>`;
      }
    }

    return `
    <div class="service ${statusClass}">
      <h3>${config.name}</h3>
      <p class="auth-type">Auth: ${authType.toUpperCase()}</p>
      <p class="status">${statusText}</p>
      ${actionButton}
    </div>
    `;
  }).join('')}

  <div class="summary">
    <h3>🎯 Mission Status</h3>
    <p><strong>Modal Claude:</strong> Codegen container with 8 face swap images</p>
    <p><strong>Browser Claude:</strong> This OAuth Hub (you're here!)</p>
    <p><strong>Terminal Claude:</strong> Local Mac with file access</p>
    <p><strong>Amnesia Claude:</strong> Desktop with ClickUp MCP</p>
    <hr>
    <p><strong>Services Ready:</strong> ${Object.entries(OAUTH_CONFIGS).filter(([k, c]) => isConfigured(k, c)).length} / ${Object.keys(OAUTH_CONFIGS).length}</p>
    <p><strong>Mission:</strong> Xiara Moon → Palestinian Humanitarian Work 💙</p>
    <p><small>OAuth Hub v2.0.0 - ALL ACCESS | Built for Amal 🏛️</small></p>
  </div>
</body>
</html>
  `;
  res.send(html);
});

// Initiate OAuth flow for a service
app.get('/auth/:service', (req, res) => {
  const { service } = req.params;
  const config = OAUTH_CONFIGS[service];

  if (!config) {
    return res.status(400).json({ error: 'Invalid service' });
  }

  // Generate PKCE challenge
  const { code_verifier, code_challenge } = generatePKCE();
  const state = crypto.randomBytes(32).toString('hex');

  // Store PKCE verifier and state
  pkceStore.set(state, { code_verifier, service });

  // Build authorization URL
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    state: state,
    code_challenge: code_challenge,
    code_challenge_method: 'S256'
  });

  if (config.scope) {
    params.append('scope', config.scope);
  }

  const authUrl = `${config.authUrl}?${params.toString()}`;
  res.redirect(authUrl);
});

// OAuth callback handler
app.get('/auth/callback/:service', async (req, res) => {
  const { service } = req.params;
  const { code, state } = req.query;
  const config = OAUTH_CONFIGS[service];

  if (!config || !code || !state) {
    return res.status(400).send('Invalid callback parameters');
  }

  // Retrieve PKCE verifier
  const pkceData = pkceStore.get(state);
  if (!pkceData || pkceData.service !== service) {
    return res.status(400).send('Invalid state parameter');
  }

  pkceStore.delete(state);

  try {
    // Exchange code for token
    const tokenResponse = await axios.post(config.tokenUrl, {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code: code,
      redirect_uri: config.redirectUri,
      grant_type: 'authorization_code',
      code_verifier: pkceData.code_verifier
    }, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const tokenData = tokenResponse.data;

    // Store token securely
    const tokens = await storage.getItem('tokens') || {};
    tokens[service] = {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: Date.now() + (tokenData.expires_in * 1000),
      token_type: tokenData.token_type || 'Bearer'
    };
    await storage.setItem('tokens', tokens);

    res.send(`
      <html>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1>✅ ${config.name} Authorized!</h1>
          <p>You can close this window and return to the dashboard.</p>
          <button onclick="location.href='/'">Back to Dashboard</button>
        </body>
      </html>
    `);
  } catch (error) {
    console.error(`OAuth error for ${service}:`, error.response?.data || error.message);
    res.status(500).send(`Authorization failed: ${error.message}`);
  }
});

// Token refresh middleware
async function refreshTokenIfNeeded(service) {
  const tokens = await storage.getItem('tokens') || {};
  const tokenData = tokens[service];

  if (!tokenData) {
    throw new Error(`No token found for ${service}`);
  }

  // Check if token is expired or expiring soon (5 min buffer)
  if (tokenData.expires_at - Date.now() > 5 * 60 * 1000) {
    return tokenData.access_token;
  }

  // Refresh token
  const config = OAUTH_CONFIGS[service];
  try {
    const refreshResponse = await axios.post(config.tokenUrl, {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: tokenData.refresh_token,
      grant_type: 'refresh_token'
    });

    const newTokenData = refreshResponse.data;
    tokens[service] = {
      access_token: newTokenData.access_token,
      refresh_token: newTokenData.refresh_token || tokenData.refresh_token,
      expires_at: Date.now() + (newTokenData.expires_in * 1000),
      token_type: newTokenData.token_type || 'Bearer'
    };
    await storage.setItem('tokens', tokens);

    return newTokenData.access_token;
  } catch (error) {
    console.error(`Token refresh failed for ${service}:`, error.message);
    throw error;
  }
}

// API Proxy Endpoints for Claudes to use

// ClickUp API Proxy
app.all('/api/clickup/*', async (req, res) => {
  try {
    const token = await refreshTokenIfNeeded('clickup');
    const path = req.params[0];
    const response = await axios({
      method: req.method,
      url: `https://api.clickup.com/api/v2/${path}`,
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      data: req.body,
      params: req.query
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      service: 'clickup'
    });
  }
});

// Linear API Proxy
app.all('/api/linear/*', async (req, res) => {
  try {
    const token = await refreshTokenIfNeeded('linear');
    const path = req.params[0];
    const response = await axios({
      method: req.method,
      url: `https://api.linear.app/${path}`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: req.body,
      params: req.query
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      service: 'linear'
    });
  }
});

// GitHub API Proxy
app.all('/api/github/*', async (req, res) => {
  try {
    const token = await refreshTokenIfNeeded('github');
    const path = req.params[0];
    const response = await axios({
      method: req.method,
      url: `https://api.github.com/${path}`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json'
      },
      data: req.body,
      params: req.query
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      service: 'github'
    });
  }
});

// Discord API Proxy
app.all('/api/discord/*', async (req, res) => {
  try {
    const token = await refreshTokenIfNeeded('discord');
    const path = req.params[0];
    const response = await axios({
      method: req.method,
      url: `https://discord.com/api/v10/${path}`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: req.body,
      params: req.query
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      service: 'discord'
    });
  }
});

// Codegen API Proxy
app.all('/api/codegen/*', async (req, res) => {
  try {
    const config = OAUTH_CONFIGS.codegen;
    const path = req.params[0];

    // Try OAuth token first, fallback to API key
    let authHeader;
    try {
      const token = await refreshTokenIfNeeded('codegen');
      authHeader = `Bearer ${token}`;
    } catch (error) {
      // Fallback to API key if OAuth not configured
      if (config.apiKey) {
        authHeader = `Bearer ${config.apiKey}`;
      } else {
        throw new Error('No Codegen authentication configured');
      }
    }

    const response = await axios({
      method: req.method,
      url: `https://codegen.com/api/${path}`,
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      data: req.body,
      params: req.query
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      service: 'codegen'
    });
  }
});

// Claude API (Anthropic) Proxy
app.all('/api/claude/*', async (req, res) => {
  try {
    const config = OAUTH_CONFIGS.anthropic;
    if (!config.apiKey) {
      return res.status(500).json({ error: 'Anthropic API key not configured' });
    }

    const path = req.params[0];
    const response = await axios({
      method: req.method,
      url: `${config.apiUrl}/${path}`,
      headers: {
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      data: req.body,
      params: req.query
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      service: 'anthropic'
    });
  }
});

// n8n Webhook/API Proxy
app.all('/api/n8n/*', async (req, res) => {
  try {
    const config = OAUTH_CONFIGS.n8n;
    const path = req.params[0];

    // Create basic auth header
    const authString = Buffer.from(`${config.username}:${config.password}`).toString('base64');

    const response = await axios({
      method: req.method,
      url: `${config.webhookUrl}/${path}`,
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json'
      },
      data: req.body,
      params: req.query
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      service: 'n8n'
    });
  }
});

// Status endpoint for n8n workflows
app.get('/status', async (req, res) => {
  const tokens = await storage.getItem('tokens') || {};
  res.json({
    timestamp: new Date().toISOString(),
    services: Object.keys(OAUTH_CONFIGS).map(key => ({
      service: key,
      authorized: !!tokens[key],
      expires_at: tokens[key]?.expires_at
    }))
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🏛️ Claude OAuth Hub running on http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});
