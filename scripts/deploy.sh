#!/bin/bash

set -e

echo "🚀 Mentes.ia - Deployment Script"
echo ""

echo "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ Prerequisites OK"
echo ""

echo "📝 Running pre-deployment checks..."
echo ""

echo "1️⃣  Type checking..."
npm run typecheck || { echo "❌ Type check failed"; exit 1; }
echo "✅ Type check passed"
echo ""

echo "2️⃣  Linting..."
npm run lint || { echo "⚠️  Linting issues found (continuing anyway)"; }
echo ""

echo "3️⃣  Running tests..."
npm run test || { echo "⚠️  Tests failed (continuing anyway)"; }
echo ""

echo "4️⃣  Building production bundle..."
npm run build || { echo "❌ Build failed"; exit 1; }
echo "✅ Build successful"
echo ""

echo "📊 Bundle size analysis..."
du -h dist/assets/*.js | sort -h
echo ""

echo "✅ Deployment preparation complete!"
echo ""
echo "📦 Next steps:"
echo ""
echo "For Vercel:"
echo "  vercel --prod"
echo ""
echo "For Netlify:"
echo "  netlify deploy --prod --dir=dist"
echo ""
echo "For manual deployment:"
echo "  - Upload the 'dist' folder to your server"
echo "  - Configure web server (Apache/Nginx)"
echo "  - Set environment variables"
echo ""
