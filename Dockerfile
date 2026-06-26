FROM node:24-alpine3.22 AS builder

WORKDIR /app

RUN apk update && apk upgrade --no-cache && \
    apk add --no-cache \
    bash \
    python3 \
    py3-pip \
    alpine-sdk \
    chromium \
    harfbuzz

COPY package*.json ./
RUN npm install -g typescript
RUN npm install

COPY src ./src
COPY tsconfig.json ./

ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build 2>&1

#######################################

FROM node:24-alpine3.22

WORKDIR /app

RUN apk update && apk upgrade --no-cache && \
    apk add --no-cache \
    bash \
    dos2unix \
    python3 \
    py3-pip \
    chromium \
    harfbuzz \
 && pip3 install --break-system-packages awscli \
 && rm -rf /var/cache/apk/*

COPY package*.json ./
RUN npm install -g pm2 && npm install --omit=dev

COPY entrypoint.sh ./
RUN dos2unix /app/entrypoint.sh && chmod +x /app/entrypoint.sh

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist

ENTRYPOINT ["/bin/bash", "-c", "/app/entrypoint.sh"]