FROM node:24-alpine3.22 AS builder
ADD . /app
WORKDIR /app
RUN apk update && apk upgrade --no-cache
RUN apk add --no-cache \
    bash \
    python3 \
    py3-pip \
    alpine-sdk \
    chromium \
    harfbuzz

COPY package*.json /app/
RUN npm install -g typescript
COPY src ./src
COPY tsconfig.json ./
RUN npm cache clean --force
RUN rm -rf node_modules
# RUN npm rm @types/glob @types/rimraf minimatch @types/minimatch
RUN npm install
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

##RUN npm run build

FROM node:24-alpine3.22

ADD . /app
WORKDIR /app

RUN apk update && apk upgrade --no-cache

RUN apk add --no-cache \
    bash \
    python3 \
    py3-pip \
    chromium \
    harfbuzz \
 && pip3 install --break-system-packages awscli \
 && apk del cups cups-libs cups-client 2>/dev/null || true \
 && rm -rf /var/cache/apk/*

COPY package*.json /app/
RUN npm install pm2 -g
RUN npm install sharp
COPY --from=builder ./app/dist/ .

RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/bin/bash", "-c", "/app/entrypoint.sh"]