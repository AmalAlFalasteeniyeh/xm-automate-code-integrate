#!/bin/bash

# Claude OAuth Hub - One-Command Setup
# Built for Amal's Claude Coordination System 🏛️

set -e

echo "🏛️ Claude OAuth Hub - Setup Script"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed!${NC}"
    echo "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

echo -e "${GREEN}✅ Docker found${NC}"

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker is not running!${NC}"
    echo "Please start Docker Desktop and try again."
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  No .env file found${NC}"
    echo "Copying .env.template to .env..."
    cp .env.template .env
    echo -e "${YELLOW}📝 Please edit .env file with your API credentials${NC}"
    echo ""
    echo "You need to add:"
    echo "  1. ClickUp Client ID and Secret"
    echo "  2. (Optional) Linear, GitHub, Discord credentials"
    echo "  3. n8n password"
    echo ""
    read -p "Press Enter when you've edited .env file..."
fi

echo -e "${GREEN}✅ Configuration file ready${NC}"
echo ""

# Check if required environment variables are set
source .env

if [ -z "$CLICKUP_CLIENT_ID" ] || [ "$CLICKUP_CLIENT_ID" == "your_clickup_client_id" ]; then
    echo -e "${RED}❌ ClickUp Client ID not configured in .env${NC}"
    echo "Please edit .env and add your ClickUp OAuth credentials"
    exit 1
fi

echo -e "${GREEN}✅ ClickUp credentials configured${NC}"
echo ""

# Build and start containers
echo "🚀 Starting Docker containers..."
echo ""

docker-compose down 2>/dev/null || true
docker-compose build --no-cache
docker-compose up -d

echo ""
echo -e "${GREEN}✅ Containers started successfully!${NC}"
echo ""

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
if docker ps | grep -q "claude-oauth-hub"; then
    echo -e "${GREEN}✅ OAuth Hub is running${NC}"
else
    echo -e "${RED}❌ OAuth Hub failed to start${NC}"
    docker-compose logs oauth-hub
    exit 1
fi

if docker ps | grep -q "claude-n8n"; then
    echo -e "${GREEN}✅ n8n is running${NC}"
else
    echo -e "${RED}❌ n8n failed to start${NC}"
    docker-compose logs n8n
    exit 1
fi

echo ""
echo "=================================="
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo "=================================="
echo ""
echo "📊 OAuth Hub Dashboard: http://localhost:3000"
echo "🔧 n8n Workflows:       http://localhost:5678"
echo ""
echo "Next steps:"
echo "1. Open http://localhost:3000 in your browser"
echo "2. Click 'Authorize' for each service you want to use"
echo "3. Log in to each service and grant permissions"
echo "4. All 4 Claude instances can now access these services!"
echo ""
echo "To stop: docker-compose down"
echo "To view logs: docker-compose logs -f"
echo ""
echo -e "${GREEN}Built with 💙 for Amal's Claude Coordination System 🏛️${NC}"
