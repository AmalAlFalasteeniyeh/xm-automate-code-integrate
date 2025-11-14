# Deployment Guide

## Table of Contents

1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Production Deployment](#production-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Troubleshooting](#troubleshooting)

## Local Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Redis (optional, can use Docker)
- PostgreSQL (optional, can use Docker)

### Setup

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Start services with Docker (recommended)
docker-compose up -d redis postgres chromadb

# Run the application
npm run dev
```

The application will start on `http://localhost:3000`

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Build the application
npm run docker:build

# Start all services
npm run docker:run

# View logs
npm run docker:logs

# Stop services
npm run docker:stop
```

### Manual Docker Setup

```bash
# Build the image
docker build -t xm-automate .

# Run the container
docker run -d \
  --name xm-automate \
  -p 3000:3000 \
  --env-file .env \
  xm-automate
```

## Production Deployment

### 1. Environment Preparation

```bash
# Create production environment file
cp .env.example .env.production

# Edit with production values
nano .env.production
```

Required environment variables:
```env
NODE_ENV=production
LOG_LEVEL=info

# API Keys
ANTHROPIC_API_KEY=sk-ant-...
CLICKUP_API_KEY=pk_...
DISCORD_BOT_TOKEN=...
LINEAR_API_KEY=lin_api_...
N8N_API_KEY=...
CODEGEN_API_KEY=...

# Database URLs (production instances)
REDIS_URL=redis://production-redis:6379
POSTGRES_URL=postgresql://user:pass@production-db:5432/xm_automate
CHROMA_URL=http://production-chroma:8000
```

### 2. Database Setup

```bash
# Initialize PostgreSQL
psql -U postgres -f src/db/init.sql

# Verify tables created
psql -U postgres -d xm_automate -c "\dt"
```

### 3. Deploy with Docker Compose

```bash
# Production docker-compose
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app
```

### 4. Health Check

```bash
# Check application health
curl http://localhost:3000/health

# Expected response:
# {
#   "status": "healthy",
#   "timestamp": "2024-01-01T00:00:00.000Z",
#   "uptime": 123.456
# }
```

## Cloud Deployment

### AWS (Elastic Beanstalk)

1. **Create Dockerfile** (already included)

2. **Create .ebextensions/nodecommand.config**:
```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
```

3. **Deploy**:
```bash
eb init -p node.js xm-automate
eb create xm-automate-env
eb deploy
```

### Google Cloud Platform (Cloud Run)

```bash
# Build and push to GCR
gcloud builds submit --tag gcr.io/YOUR_PROJECT/xm-automate

# Deploy to Cloud Run
gcloud run deploy xm-automate \
  --image gcr.io/YOUR_PROJECT/xm-automate \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Azure (Container Instances)

```bash
# Build and push to ACR
az acr build --registry YOUR_REGISTRY --image xm-automate .

# Deploy
az container create \
  --resource-group YOUR_GROUP \
  --name xm-automate \
  --image YOUR_REGISTRY.azurecr.io/xm-automate \
  --ports 3000 \
  --environment-variables $(cat .env.production)
```

## Kubernetes Deployment

### 1. Create Kubernetes manifests

**deployment.yaml**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: xm-automate
spec:
  replicas: 3
  selector:
    matchLabels:
      app: xm-automate
  template:
    metadata:
      labels:
        app: xm-automate
    spec:
      containers:
      - name: xm-automate
        image: xm-automate:latest
        ports:
        - containerPort: 3000
        envFrom:
        - secretRef:
            name: xm-automate-secrets
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
```

### 2. Create secrets

```bash
kubectl create secret generic xm-automate-secrets \
  --from-env-file=.env.production
```

### 3. Deploy

```bash
kubectl apply -f k8s/
kubectl get pods
kubectl logs -f deployment/xm-automate
```

## Monitoring

### Application Logs

```bash
# Docker logs
docker-compose logs -f

# Kubernetes logs
kubectl logs -f deployment/xm-automate

# Local logs
tail -f logs/app.log
```

### Health Monitoring

```bash
# Continuous health check
watch -n 5 'curl -s http://localhost:3000/health | jq'

# Metrics
curl http://localhost:3000/api/metrics
```

## Backup and Recovery

### Database Backup

```bash
# PostgreSQL backup
docker exec xm-postgres pg_dump -U postgres xm_automate > backup.sql

# Restore
docker exec -i xm-postgres psql -U postgres xm_automate < backup.sql
```

### State Backup

```bash
# Backup Redis data
docker exec xm-redis redis-cli SAVE

# Backup state files
tar -czf state-backup.tar.gz data/state/

# Backup ChromaDB
tar -czf chroma-backup.tar.gz data/chroma/
```

## Scaling

### Horizontal Scaling

```bash
# Docker Compose
docker-compose up -d --scale app=3

# Kubernetes
kubectl scale deployment xm-automate --replicas=5
```

### Vertical Scaling

Update resource limits in docker-compose.yml or k8s manifests:

```yaml
resources:
  limits:
    memory: 2Gi
    cpu: 2000m
```

## Security

### SSL/TLS Setup

```bash
# Using Let's Encrypt with nginx
docker run -d \
  -p 80:80 -p 443:443 \
  --name nginx-proxy \
  -v /etc/nginx/certs \
  -v /etc/nginx/vhost.d \
  -v /usr/share/nginx/html \
  jwilder/nginx-proxy

docker run -d \
  --volumes-from nginx-proxy \
  jrcs/letsencrypt-nginx-proxy-companion
```

### Firewall Rules

```bash
# Allow only necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

## Troubleshooting

### Common Issues

1. **Cannot connect to Redis**
   ```bash
   # Check Redis is running
   docker-compose ps redis

   # Test connection
   docker exec -it xm-redis redis-cli ping
   ```

2. **ChromaDB connection failed**
   ```bash
   # Check ChromaDB logs
   docker-compose logs chromadb

   # Verify port is accessible
   curl http://localhost:8000/api/v1/heartbeat
   ```

3. **High memory usage**
   ```bash
   # Check container stats
   docker stats

   # Restart services
   docker-compose restart app
   ```

4. **Workflows not resuming**
   ```bash
   # Check state files exist
   ls -la data/state/

   # Verify Redis has workflow data
   docker exec xm-redis redis-cli KEYS "workflow:*"
   ```

### Debug Mode

```bash
# Enable debug logging
export LOG_LEVEL=debug
npm start

# Or in Docker
docker-compose run -e LOG_LEVEL=debug app
```

### Performance Tuning

```env
# Increase checkpoint frequency
CHECKPOINT_INTERVAL_MINUTES=2

# Adjust timeout
TIMEOUT_MS=60000

# Increase retry attempts
MAX_RETRIES=5
```

## Maintenance

### Regular Tasks

1. **Weekly**: Backup databases
2. **Monthly**: Clean old checkpoints
3. **Quarterly**: Update dependencies
4. **As needed**: Scale resources

### Updates

```bash
# Pull latest changes
git pull origin main

# Rebuild and redeploy
docker-compose down
docker-compose build
docker-compose up -d

# Verify health
curl http://localhost:3000/health
```

## Support

For deployment issues:
- Check logs first: `docker-compose logs -f`
- Verify environment variables: `docker-compose config`
- Test connectivity: `docker-compose exec app ping redis`
- Create an issue with logs and configuration (sanitized)