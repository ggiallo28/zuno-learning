#!/bin/bash

echo "🔍 Verifying Zuno Amplify + Bun setup..."

# Check Bun installation
echo "📦 Checking Bun..."
if command -v bun &> /dev/null; then
    echo "✅ Bun $(bun --version) is installed"
else
    echo "❌ Bun is not installed"
    exit 1
fi

# Check Amplify CLI
echo "🚀 Checking Amplify CLI..."
if command -v amplify &> /dev/null; then
    echo "✅ Amplify CLI $(amplify --version) is installed"
else
    echo "❌ Amplify CLI is not installed"
    exit 1
fi

# Check dependencies
echo "📚 Checking dependencies..."
if bun install --dry-run &> /dev/null; then
    echo "✅ All dependencies are properly configured"
else
    echo "❌ Dependency issues detected"
    exit 1
fi

# Check TypeScript compilation
echo "🔧 Checking TypeScript compilation..."
if bun run tsc --noEmit; then
    echo "✅ TypeScript compilation successful"
else
    echo "❌ TypeScript compilation failed"
    exit 1
fi

# Check build process
echo "🏗️ Checking build process..."
if bun run build; then
    echo "✅ Build process successful"
else
    echo "❌ Build process failed"
    exit 1
fi

# Check Amplify status
echo "☁️ Checking Amplify status..."
amplify status

echo ""
echo "🎉 Setup verification complete!"
echo "✅ Bun package manager configured"
echo "✅ Amplify CLI configured"
echo "✅ TypeScript compilation working"
echo "✅ Build process working"
echo "✅ Development environment ready"
echo ""
echo "🚀 Next steps:"
echo "   • Run 'bun run dev' to start development server"
echo "   • Run 'amplify add api' to add GraphQL API"
echo "   • Run 'amplify add auth' to add authentication"
echo "   • Run 'amplify push' to deploy backend services"