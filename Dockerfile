FROM node:18-alpine

WORKDIR /app

COPY api ./api
COPY viewer ./viewer

RUN npm ci --prefix api --only=production

EXPOSE 4000

CMD ["node", "api/src/server.js"]