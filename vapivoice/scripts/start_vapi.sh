#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# START VAPI VOICE SERVICES
# ═══════════════════════════════════════════════════════════════

echo "🚀 Starting Vapi Voice System..."
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

# Create logs directory
mkdir -p logs

# Stop existing services
echo "🛑 Stopping existing services..."
pkill -9 -f "python backend/server.py" 2>/dev/null
lsof -ti :4000 | xargs kill -9 2>/dev/null
lsof -ti :8080 | xargs kill -9 2>/dev/null
sleep 2

# Activate virtual environment
echo "📦 Activating virtual environment..."
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Creating..."
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

# Start Backend
echo "🔧 Starting Backend API Server..."
python backend/server.py > logs/backend.log 2>&1 &
BACKEND_PID=$!
sleep 3

# Check if backend started
if lsof -ti :4000 > /dev/null 2>&1; then
    echo "✅ Backend started successfully (PID: $BACKEND_PID, Port: 4000)"
else
    echo "❌ Backend failed to start. Check logs/backend.log"
    exit 1
fi

# Start Frontend (if using npm)
if [ -f "frontend/package.json" ]; then
    echo "🌐 Starting Frontend..."
    cd frontend
    npm run dev > ../logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    cd ..
    sleep 2
    echo "✅ Frontend started (PID: $FRONTEND_PID)"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "✅ VAPI VOICE SERVICES STARTED!"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "📊 Access Points:"
echo "   Backend API:   http://localhost:4000"
echo "   API Docs:      http://localhost:4000/docs"
if [ -f "frontend/package.json" ]; then
    echo "   Frontend:      http://localhost:5173"
fi
echo ""
echo "📝 Log Files:"
echo "   Backend:       logs/backend.log"
if [ -f "frontend/package.json" ]; then
    echo "   Frontend:      logs/frontend.log"
fi
echo ""
echo "🎤 To use with Vapi:"
echo "   1. Go to: https://dashboard.vapi.ai"
echo "   2. Configure webhook: http://your-ngrok-url/api/vapi/webhook"
echo "   3. Add flight search function"
echo "   4. Test your voice assistant"
echo ""
echo "📊 Monitor logs:"
echo "   tail -f logs/backend.log"
echo ""
echo "🛑 To stop all services:"
echo "   ./stop_vapi.sh"
echo ""
echo "═══════════════════════════════════════════════════════════════"


