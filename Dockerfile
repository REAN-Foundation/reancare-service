FROM node:24-alpine3.22 AS builder

WORKDIR /app

RUN apk add --no-cache \
    bash \
    python3 \
    py3-pip \
    alpine-sdk

COPY package*.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm install -g typescript && \
    npm ci

COPY tsconfig.json .
COPY src ./src

ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN npm run build
RUN npm prune --omit=dev


FROM node:24-alpine3.22

WORKDIR /app

RUN apk add --no-cache \
    bash \
    dos2unix \
    python3 \
    py3-pip \
    chromium \
    harfbuzz && \
    pip3 install --break-system-packages awscli && \
    npm install -g pm2

COPY entrypoint.sh .
RUN dos2unix entrypoint.sh && chmod +x entrypoint.sh

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./

ENTRYPOINT ["/bin/bash","-c","/app/entrypoint.sh"]