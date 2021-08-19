#!/bin/bash

aws s3 --region "us-west-2" cp s3://$S3_CONFIG_BUCKET/config.properties /app/.env.$NODE_ENV

aws s3 --region "us-west-2" cp s3://$S3_CONFIG_BUCKET/reancaredev-firebase-adminsdk-v0a0f-348a049fc8.json /app/firebase/fcm_adminsdk_credentials.json

cd /app
#Add scripts here!

#Regenerate the database if needed! For dev only
#npx sequelize-cli db:migrate

pm2-runtime index.js
