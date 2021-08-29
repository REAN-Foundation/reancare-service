#!/bin/bash

# Add config/creds copying here...
# aws s3 --region "us-west-2" cp s3://$S3_CONFIG_BUCKET/env.config /app/.env.$NODE_ENV
# aws s3 --region "us-west-2" cp s3://$S3_CONFIG_BUCKET/reancare_firebase_creds.json /app/creds/reancare_firebase_creds.json


cd /app
# Add any other scripts here...

# Start the service
npm run start

# pm2-runtime ./dist/index.js
