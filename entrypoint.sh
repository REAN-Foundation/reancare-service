#!/bin/bash

# Add config/creds copying here..
az storage blob download --container-name $CONTAINER_NAME --name env.config --file /app/.env --account-name $ACCOUNT_NAME --account-key $ACCOUNT_KEY
az storage blob download --container-name $CONTAINER_NAME --name reancare.config.json --file /app/reancare.config.json --account-name $ACCOUNT_NAME --account-key $ACCOUNT_KEY
az storage blob download --container-name $CONTAINER_NAME --name internal.clients.seed.json --file /app/seed.data/internal.clients.seed.json --account-name $ACCOUNT_NAME --account-key $ACCOUNT_KEY
az storage blob download --container-name $CONTAINER_NAME --name internal.test.users.seed.json --file /app/seed.data/internal.test.users.seed.json --account-name $ACCOUNT_NAME --account-key $ACCOUNT_KEY
az storage blob download --container-name $CONTAINER_NAME --name system.admin.seed.json --file /app/seed.data/system.admin.seed.json --account-name $ACCOUNT_NAME --account-key $ACCOUNT_KEY
az storage blob download --container-name $CONTAINER_NAME --name system.users.seed.json --file /app/seed.data/system.users.seed.json --account-name $ACCOUNT_NAME --account-key $ACCOUNT_KEY

# aws s3 cp s3://$S3_CONFIG_BUCKET/$S3_CONFIG_PATH/gcp_creds/reancareapi-307085d27fd7.json /app/creds/reancareapi-307085d27fd7.json
# aws s3 cp s3://$S3_CONFIG_BUCKET/$S3_CONFIG_PATH/gcp_creds/reancare_firebase_creds.json /app/creds/reancare_firebase_creds.json
# aws s3 cp s3://$S3_CONFIG_BUCKET/$S3_CONFIG_PATH/gcp_creds/reancare_firebase_adminsdk.json /app/creds/reancare_firebase_adminsdk.json

cd /app
# Add any other scripts here...
# Start the service
# npm run start
pm2-runtime src/index.js
