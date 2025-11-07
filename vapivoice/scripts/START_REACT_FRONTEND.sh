#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║     🚀 STARTING REACT + VITE VAPI FRONTEND 🚀               ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

cd "$(dirname "$0")/frontend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "✅ Starting React + Vite development server..."
echo "🌐 URL: http://localhost:5173"
echo "📱 Features:"
echo "   - Real-time Vapi voice integration"
echo "   - Beautiful flight cards"
echo "   - Live transcript display"
echo "   - Responsive design"
echo ""
echo "🎤 Say: 'Show me flights from Bangalore to Jeddah'"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""

npm run dev

