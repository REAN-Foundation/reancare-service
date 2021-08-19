FROM ubuntu:16.04
RUN apt-get clean
RUN apt-get update --fix-missing
RUN apt-get install -y build-essential checkinstall curl awscli
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 12.14.1
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

ADD . /app/firebase
ENV GOOGLE_APPLICATION_CREDENTIALS /app/firebase/fcm_adminsdk_credentials.json

ADD . /app/tmp/
ADD . /app/tmp/resources
ADD . /app/tmp/resources/uploads
ADD . /app/tmp/resources/downloads

RUN npm install
RUN npm install pm2 -g

#Install sequelize-cli to migrate databases. For dev only
# RUN npm install sequelize-cli -g

RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/bin/bash", "-c", "/app/entrypoint.sh"]
