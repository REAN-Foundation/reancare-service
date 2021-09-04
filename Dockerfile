
# Run locally

# FROM node:14.17.0
# RUN apt-get clean
# RUN apt-get update --fix-missing
# RUN apt-get install -y build-essential checkinstall curl awscli
# RUN apt-get install bash

# RUN node -v
# RUN npm -v

# ADD . /app
 
# ADD . /app/tmp/
# ADD . /app/tmp/resources
# ADD . /app/tmp/resources/uploads
# ADD . /app/tmp/resources/downloads

# WORKDIR /app

# RUN npm install -g typescript
# RUN npm install pm2 -g
# RUN npm install
# ENTRYPOINT ["node", "index.js"]

#########################################################################

# Run on the server

FROM ubuntu:18.04
RUN apt-get clean
RUN apt-get update --fix-missing
RUN apt-get install -y curl
RUN apt-get install -y checkinstall
RUN apt-get install -y build-essential
RUN apt-get install -y awscli

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 14.17.512
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash
RUN apt-get install -y nodejs
RUN curl --silent -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.2/install.sh | bash
RUN source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH
RUN node -v
RUN npm -v

ADD . /app
WORKDIR /app
ADD . /app/creds

ENV GOOGLE_APPLICATION_CREDENTIALS /app/creds/reancare_firebase_creds.json

ADD . /app/tmp/
ADD . /app/tmp/resources
ADD . /app/tmp/resources/uploads
ADD . /app/tmp/resources/downloads

RUN npm install -g typescript
RUN npm install pm2 -g
RUN npm install 

#Optionally build if using pm2-runtime
RUN npm run build

RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/bin/bash", "-c", "/app/entrypoint.sh"]

# Please note that multi-stage build is preferred
# i.e. First compile with a temporary docker image 
# and copy that to build the final image
