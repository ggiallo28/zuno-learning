#!/bin/bash

# Zuno Development Setup Script
echo "🚀 Setting up Zuno development environment..."

# Check if Amplify CLI is installed
if ! command -v amplify &> /dev/null; then
    echo "❌ Amplify CLI not found. Installing..."
    npm install -g @aws-amplify/cli
fi

# Check if Bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Bun not found. Please install Bun first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies with Bun..."
bun install

# Check Amplify status
echo "🔍 Checking Amplify status..."
amplify status

echo "✅ Development environment ready!"
echo "🎯 Run 'bun run dev' to start the development server"
echo "🔧 Run 'bun run amplify:mock' to start Amplify mock services"