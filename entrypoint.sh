#!/bin/bash

# Add config/creds copying here..
aws s3 cp s3://$S3_CONFIG_BUCKET/$S3_CONFIG_PATH/env.config /app/.env
aws s3 cp s3://$S3_CONFIG_BUCKET/$S3_CONFIG_PATH/reancare.config.json /app/reancare.config.json
aws s3 cp s3://$S3_CONFIG_BUCKET/$S3_CONFIG_PATH/seed_data/internal.clients.seed.json /app/seed.data/internal.clients.seed.json
aws s3 cp s3://$S3_CONFIG_BUCKET/$S3_CONFIG_PATH/seed_data/internal.test.users.seed.json /app/seed.data/internal.test.users.seed.json
aws s3 cp s3://$S3_CONFIG_BUCKET/$S3_CONFIG_PATH/seed_data/system.admin.seed.json /app/seed.data/system.admin.seed.json
aws s3 cp s3://$S3_CONFIG_BUCKET/$S3_CONFIG_PATH/gcp_creds/reancareapi-307085d27fd7.json /app/creds/reancareapi-307085d27fd7.json
aws s3 cp s3://$S3_CONFIG_BUCKET/$S3_CONFIG_PATH/gcp_creds/reancare_firebase_creds.json /app/creds/reancare_firebase_creds.json
aws s3 cp s3://$S3_CONFIG_BUCKET/$S3_CONFIG_PATH/gcp_creds/reancare_firebase_adminsdk.json /app/creds/reancare_firebase_adminsdk.json

cd /app
# Add any other scripts here...
# Start the service
# npm run start
pm2-runtime src/index.js
