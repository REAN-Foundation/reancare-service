FROM node:14.17-alpine
RUN apk update
RUN apk add bash
RUN apk add curl

RUN apk add --no-cache \
        python3 \
        py3-pip \
    && pip3 install --upgrade pip \
    && pip3 install \
        awscli \
    && rm -rf /var/cache/apk/*

RUN aws --version   # Just to make sure its installed alright
RUN apk add --update alpine-sdk

ADD . /app
WORKDIR /app
COPY package*.json /app/
ADD . /app/creds

ENV GOOGLE_APPLICATION_CREDENTIALS /app/creds/reancare_firebase_creds.json

ADD . /app/tmp/
ADD . /app/tmp/resources
ADD . /app/tmp/resources/uploads
ADD . /app/tmp/resources/downloads

RUN npm install -g typescript
RUN npm install -g ts-node
RUN npm install -g sequelize-cli
RUN npm install pm2 -g
RUN npm install

#Build the service
RUN npm run build

COPY . .

RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/bin/bash", "-c", "/app/entrypoint.sh"]
