# Backend API for the Reader-translate app
FROM node:22-alpine

WORKDIR /app

# Install production dependencies first so this layer is cached unless the
# lockfile changes. devDependencies (nodemon) are skipped.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy the application: entry point, src (routes/services + 69M dictionary
# JSON) and public/book1 (static epub assets served at /book1).
COPY --chown=node:node . .

USER node

ENV NODE_ENV=production
# The app reads PORT from the environment (defaults to 3003). Override via
# docker-compose / -e if you map a different port.
ENV PORT=3003
EXPOSE 3003

CMD ["node", "index.js"]
