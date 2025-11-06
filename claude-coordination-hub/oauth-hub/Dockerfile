FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install --production

# Copy application code
COPY server.js ./

# Create data directory for persistent storage
RUN mkdir -p /app/data/tokens && chmod 777 /app/data

EXPOSE 3000

CMD ["node", "server.js"]
