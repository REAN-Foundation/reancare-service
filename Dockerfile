FROM node:18.20.8-alpine3.21 AS builder
ADD . /app
RUN apk add bash
RUN apk add --no-cache \
        python3 \
        py3-pip \
    && rm -rf /var/cache/apk/*
RUN apk add --update alpine-sdk
RUN apk add chromium \
    harfbuzz
WORKDIR /app
COPY package*.json /app/
RUN npm install -g typescript
COPY src ./src
COPY tsconfig.json ./
RUN npm cache clean --force
RUN rm -rf node_modules
# RUN npm rm @types/glob @types/rimraf minimatch @types/minimatch
RUN npm install
RUN npm run build

##RUN npm run build

FROM node:18.20.8-alpine3.21
RUN apk add bash
RUN apk add --no-cache \
        python3 \
        py3-pip \
    && pip3 install --break-system-packages awscli \
    && rm -rf /var/cache/apk/*

RUN apk add --update alpine-sdk
RUN apk add chromium \
    harfbuzz
RUN apk update
RUN apk upgrade
ADD . /app
WORKDIR /app

COPY package*.json /app/
RUN npm install pm2 -g
RUN npm install sharp
COPY --from=builder ./app/dist/ .

RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/bin/bash", "-c", "/app/entrypoint.sh"]
