#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# STOP VAPI VOICE SERVICES
# ═══════════════════════════════════════════════════════════════

echo "🛑 Stopping all Vapi Voice services..."
echo ""

# Stop Backend
echo "⏹️  Stopping Backend..."
pkill -9 -f "python backend/server.py"
lsof -ti :4000 | xargs kill -9 2>/dev/null

# Stop Frontend
echo "⏹️  Stopping Frontend..."
pkill -9 -f "npm run dev"
pkill -9 -f "vite"
lsof -ti :5173 | xargs kill -9 2>/dev/null
lsof -ti :8080 | xargs kill -9 2>/dev/null

sleep 2

echo ""
echo "✅ All Vapi Voice services stopped!"
echo ""


