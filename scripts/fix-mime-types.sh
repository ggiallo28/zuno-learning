#!/bin/bash

# Fix MIME types for JavaScript files in S3 bucket
# This script sets the correct Content-Type for .js and .mjs files

# Get the S3 bucket name from Amplify status
BUCKET_NAME=$(amplify status | grep -A 20 "Hosting" | grep "HostingBucketName" | cut -d':' -f2 | tr -d ' ')

if [ -z "$BUCKET_NAME" ]; then
    echo "Could not find S3 bucket name. Getting from CloudFormation..."
    STACK_NAME="amplify-zuno-dev-$(amplify status | grep -o '[0-9a-f]\{5\}')"
    BUCKET_NAME=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --query 'Stacks[0].Outputs[?OutputKey==`HostingBucketName`].OutputValue' --output text 2>/dev/null)
fi

if [ -z "$BUCKET_NAME" ]; then
    echo "Error: Could not determine S3 bucket name"
    exit 1
fi

echo "Fixing MIME types for bucket: $BUCKET_NAME"

# Fix .js files
echo "Setting Content-Type for .js files..."
aws s3 cp s3://$BUCKET_NAME/assets/ s3://$BUCKET_NAME/assets/ \
    --recursive \
    --exclude "*" \
    --include "*.js" \
    --metadata-directive REPLACE \
    --content-type "application/javascript" \
    --cache-control "public, max-age=31536000"

# Fix .mjs files
echo "Setting Content-Type for .mjs files..."
aws s3 cp s3://$BUCKET_NAME/assets/ s3://$BUCKET_NAME/assets/ \
    --recursive \
    --exclude "*" \
    --include "*.mjs" \
    --metadata-directive REPLACE \
    --content-type "application/javascript" \
    --cache-control "public, max-age=31536000"

# Fix main.js if it exists in root
aws s3 cp s3://$BUCKET_NAME/main.js s3://$BUCKET_NAME/main.js \
    --metadata-directive REPLACE \
    --content-type "application/javascript" \
    --cache-control "public, max-age=31536000" 2>/dev/null || echo "No main.js in root"

echo "MIME types fixed. CloudFront cache may need time to update."
echo "You can invalidate the cache with:"
echo "aws cloudfront create-invalidation --distribution-id <DISTRIBUTION_ID> --paths '/*'"