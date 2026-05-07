FROM node:18-alpine

WORKDIR /app

COPY api/package*.json ./
RUN npm ci --only=production

COPY api/src ./src
COPY api/assets ./assets
COPY viewer ./viewer

EXPOSE 4000

CMD ["node", "src/server.js"]