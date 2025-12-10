#!/bin/bash

set -e

echo "🚀 Building Mentes.ia for Mobile..."
echo ""

echo "1️⃣  Installing dependencies..."
npm install

echo ""
echo "2️⃣  Running type check..."
npm run typecheck

echo ""
echo "3️⃣  Building production bundle..."
npm run build

echo ""
echo "4️⃣  Checking if Capacitor is installed..."
if ! command -v cap &> /dev/null; then
    echo "📦 Installing Capacitor CLI..."
    npm install -g @capacitor/cli
fi

echo ""
echo "5️⃣  Syncing Capacitor..."
npx cap sync

echo ""
echo "✅ Build complete!"
echo ""
echo "📱 Next steps:"
echo ""
echo "For Android:"
echo "  npx cap open android"
echo "  Build in Android Studio"
echo ""
echo "For iOS:"
echo "  npx cap open ios"
echo "  Build in Xcode"
echo ""
