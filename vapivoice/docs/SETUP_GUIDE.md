# Vapivoice Setup Guide

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r ../requirements.txt

# Run server (port 4000)
python server.py
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server (port 5173)
npm run dev

# Build for production
npm run build
```

### ngrok Setup (for Vapi Webhooks)

```bash
# Download ngrok from https://ngrok.com

# Create account and get authtoken
ngrok config add-authtoken YOUR_AUTH_TOKEN

# Start tunnel to port 4000
ngrok http 4000

# Copy the HTTPS URL and use it in Vapi Dashboard
```

## Project Structure

```
vapivoice/
├── backend/
│   ├── server.py              # FastAPI main app
│   ├── mock_hotels_database.py # Hotel mock data
│   └── bookings.db            # SQLite database
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main app component
│   │   ├── components/
│   │   │   ├── VoiceButton.jsx # Voice UI component
│   │   │   └── HotelCard.jsx   # Hotel card component
│   │   └── App.css            # Styling
│   └── public/                # Static assets
└── docs/                      # Documentation
```

## Key Features

- **Voice AI**: Vapi.ai integration for natural language conversations
- **Flight Search**: Search flights with airline details and prices
- **Hotel Search**: Search hotels with ratings and Google Maps links
- **Visual Cards**: Flight and hotel cards display in widget
- **Real-time Polling**: Frontend polls backend for search results

## API Endpoints

### Backend (Port 4000)

- `POST /webhooks/vapi` - Vapi webhook for tool calls
- `POST /tool-calls` - Alternative endpoint for Vapi webhooks
- `GET /api/flight-cards/{call_id}` - Get cached flight cards
- `GET /api/hotel-cards/{call_id}` - Get cached hotel cards
- `POST /api/clear-cache` - Clear all cached cards

### Frontend (Port 5173)

- Serves React application
- WebSocket connection to Vapi for real-time conversation

## Troubleshooting

### Backend won't start
- Check Python version: `python --version`
- Ensure all dependencies installed: `pip install -r requirements.txt`
- Check port 4000 isn't in use: `lsof -i :4000`

### Frontend won't load
- Check Node.js version: `node --version`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check port 5173 isn't in use: `lsof -i :5173`

### Cards not displaying
- Check ngrok URL is correct in Vapi Dashboard
- Verify `search_flights` and `search_hotels` functions are configured
- Check browser console for JavaScript errors
- Check backend logs for 500 errors

## Environment Variables

Create `.env` file in project root:

```
VAPI_API_KEY=your_api_key_here
```

See `config/ENV_TEMPLATE.txt` for all available options.

