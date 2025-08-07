#!/bin/bash

# Amplify Setup Script for Zuno Learning App
echo "🚀 Setting up AWS Amplify for Zuno Learning App"

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

# Initialize Amplify project
echo "📦 Initializing Amplify project..."
amplify init --yes

# Add authentication
echo "🔐 Adding authentication..."
amplify add auth

# Add GraphQL API
echo "📊 Adding GraphQL API..."
amplify add api

# Add REST API
echo "🌐 Adding REST API..."
amplify add api

# Add storage
echo "💾 Adding storage..."
amplify add storage

# Push to cloud
echo "☁️ Deploying to AWS..."
amplify push --yes

echo "✅ Amplify setup complete!"
echo "🎯 Next steps:"
echo "   1. Run 'bun run dev' to start development server"
echo "   2. Run 'amplify console' to view AWS resources"
echo "   3. Run 'amplify mock' for local development"