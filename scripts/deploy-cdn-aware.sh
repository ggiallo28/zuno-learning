#!/bin/bash

# CDN-aware deployment script for Zuno
# This script builds and deploys with proper cache headers to avoid invalidation issues

set -e

echo "🚀 Starting CDN-aware deployment..."

# Build the application
echo "📦 Building application..."
bun run build

# Get S3 bucket name
BUCKET_NAME="zuno-hosting-bucket-dev"
echo "📡 Deploying to bucket: $BUCKET_NAME"

# Deploy with proper cache headers
echo "⬆️  Uploading files with CDN-friendly cache headers..."

# Upload HTML files with short cache (5 minutes)
echo "📄 Uploading HTML files..."
aws s3 sync dist/ s3://$BUCKET_NAME/ \
  --exclude "*" \
  --include "*.html" \
  --cache-control "public, max-age=300, must-revalidate" \
  --content-type "text/html" \
  --delete

# Upload hashed assets with long cache (1 year)
echo "🎨 Uploading hashed assets..."
aws s3 sync dist/assets/ s3://$BUCKET_NAME/assets/ \
  --cache-control "public, max-age=31536000, immutable" \
  --delete

# Set specific content types for JavaScript files
echo "📜 Setting JavaScript content types..."
aws s3 cp s3://$BUCKET_NAME/assets/ s3://$BUCKET_NAME/assets/ \
  --recursive \
  --exclude "*" \
  --include "*.js" \
  --metadata-directive REPLACE \
  --content-type "application/javascript" \
  --cache-control "public, max-age=31536000, immutable"

# Set specific content types for CSS files
echo "🎨 Setting CSS content types..."
aws s3 cp s3://$BUCKET_NAME/assets/ s3://$BUCKET_NAME/assets/ \
  --recursive \
  --exclude "*" \
  --include "*.css" \
  --metadata-directive REPLACE \
  --content-type "text/css" \
  --cache-control "public, max-age=31536000, immutable"

# Upload other static assets
echo "🖼️  Uploading other assets..."
aws s3 sync dist/ s3://$BUCKET_NAME/ \
  --exclude "*.html" \
  --exclude "assets/*" \
  --cache-control "public, max-age=86400"

# Get CloudFront distribution ID
DISTRIBUTION_ID=$(aws cloudfront list-distributions --query 'DistributionList.Items[?contains(Origins.Items[0].DomainName, `zuno-hosting-bucket`)].Id' --output text)

if [ -n "$DISTRIBUTION_ID" ]; then
  echo "🌐 CloudFront Distribution ID: $DISTRIBUTION_ID"
  
  # Only invalidate HTML files (assets have content hashes so no invalidation needed)
  echo "🔄 Invalidating HTML files only..."
  aws cloudfront create-invalidation \
    --distribution-id $DISTRIBUTION_ID \
    --paths "/index.html" "/" \
    --query 'Invalidation.Id' \
    --output text
  
  echo "✅ Invalidation created for HTML files only"
else
  echo "⚠️  Could not find CloudFront distribution ID"
fi

echo "🎉 CDN-aware deployment completed!"
echo "🌐 Application URL: https://d2zrgcpjugs332.cloudfront.net"
echo ""
echo "📊 Cache Strategy:"
echo "  - HTML files: 5 minutes cache (always fresh)"
echo "  - Hashed assets: 1 year cache (immutable)"
echo "  - Other files: 1 day cache"
echo ""
echo "💡 Benefits:"
echo "  - No cache invalidation needed for assets (content hashes)"
echo "  - Fast loading (long cache for assets)"
echo "  - Always fresh HTML (short cache)"