# syntax=docker/dockerfile:1

ARG NODE_ENV=production
FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --no-frozen-lockfile

COPY . .

# Only build in production
RUN if [ "$NODE_ENV" = "production" ]; then pnpm build; fi

EXPOSE 3001

CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"development\" ]; then pnpm dev --port 3001; else pnpm start --port 3001; fi"]
