# Vapivoice Architecture

## System Overview

```
┌─────────────────┐
│   User (Voice)  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│         Vapi.ai (Voice AI)              │
│  - Speech-to-text                       │
│  - AI conversation                      │
│  - Function calling                     │
└────────┬────────────────┬───────────────┘
         │ webhooks       │
         ▼                ▼
    ┌────────────────────────────┐
    │   Backend (FastAPI)        │
    │  - /webhooks/vapi          │
    │  - search_flights()        │
    │  - search_hotels()         │
    │  - Cache management        │
    └─────────┬──────────────────┘
              │
         ┌────▼──────┐
         │   Cache   │
         │  Memory   │
         └───────────┘
              │
              ▼
    ┌─────────────────────────┐
    │   Frontend (React)       │
    │  - Polling for cards     │
    │  - Render UI             │
    │  - Display results       │
    └─────────────────────────┘
              │
              ▼
         ┌─────────────┐
         │   User (UI) │
         └─────────────┘
```

## Data Flow: Flight Search

```
1. User asks: "Find flights from Bangalore to Riyadh"
   ↓
2. Vapi captures speech → AI processes → calls search_flights()
   ↓
3. Webhook: POST /webhooks/vapi with functionCall
   ↓
4. Backend:
   - Extracts function parameters
   - Searches flight database
   - Formats results as Vapi cards
   - Caches cards with call_id
   - Returns response with cards
   ↓
5. Frontend:
   - Detects keyword in AI transcript
   - Starts polling /api/flight-cards/latest
   - Gets cards from backend cache
   - Renders flight cards in widget
   ↓
6. User sees flight cards displayed
```

## Data Flow: Hotel Search

```
1. User asks: "Find hotels in Riyadh"
   ↓
2. Vapi → AI → calls search_hotels()
   ↓
3. Webhook: POST /webhooks/vapi with functionCall
   ↓
4. Backend:
   - Extracts city parameter
   - Searches hotel database (mock data)
   - Formats results with Google Maps URLs
   - Caches cards
   - Returns response
   ↓
5. Frontend:
   - Detects "hotel" keyword
   - Polls /api/hotel-cards/latest
   - Receives hotel cards
   - Renders orange hotel cards
   ↓
6. User sees hotel options with locations
```

## Component Architecture

### Backend (server.py)

```python
# Main components
- FastAPI app initialization
- CORS and middleware setup
- In-memory caches:
  - flight_cards_cache = {}
  - hotel_cards_cache = {}
  
# Endpoints
- POST /webhooks/vapi
  - Handles Vapi tool calls
  - Processes search_flights & search_hotels
  
- GET /api/flight-cards/{call_id}
  - Returns cached flight cards
  
- GET /api/hotel-cards/{call_id}
  - Returns cached hotel cards
  
- POST /api/clear-cache
  - Clears all caches on new call

# Functions
- search_flights(origin, destination, date)
  - Queries flight database
  - Returns formatted cards
  
- search_hotels(city)
  - Queries hotel database
  - Returns formatted cards with maps
```

### Frontend (VoiceButton.jsx)

```javascript
// State management
- isConnected: boolean (Vapi connection status)
- callId: string (Current call ID)
- shouldPollFlights: boolean (Flight search triggered)
- shouldPollHotels: boolean (Hotel search triggered)
- transcript: array (Conversation messages)

// Event listeners
- call-start: Initialize polling
- call-end: Cleanup
- message event: Keyword detection
  - "flight" → setShouldPollFlights(true)
  - "hotel" → setShouldPollHotels(true)

// Polling logic
- useEffect for flights (every 2 seconds, max 45 attempts)
- useEffect for hotels (every 2 seconds, max 45 attempts)
- Renders cards when found
- Stops polling after cards displayed

// Card rendering
- Creates HTML for flight cards (teal style)
- Creates HTML for hotel cards (orange style)
- Posts message to App.jsx for main display
```

### Frontend (App.jsx)

```javascript
// State management
- flights: array (Flight results)
- hotels: array (Hotel results)
- showFlights: boolean (Show flight section)
- showHotels: boolean (Show hotel section)
- transcript: array (Chat messages)

// Message handling
- Listens for 'flight-card-data' from VoiceButton
- Listens for 'hotel-card-data' from VoiceButton
- Updates UI with received cards
- Clears cards on new call

// UI rendering
- Displays flight cards in teal grid
- Displays hotel cards in orange grid
- Shows transcript in widget area
```

## Caching Strategy

### Flight Cache
```
flight_cards_cache = {
  "call_id_123": {
    "cards": [...],
    "timestamp": 1234567890,
    "text": "Found 6 flights..."
  }
}
```

### Hotel Cache
```
hotel_cards_cache = {
  "call_id_456": {
    "cards": [...],
    "timestamp": 1234567890,
    "city": "Riyadh"
  }
}
```

### Cache Clearing
- On page load: `/api/clear-cache`
- On call start: `/api/clear-cache`
- Ensures fresh start for each session

## Polling Strategy

### Flight Polling
1. Triggered when: "flight" keyword detected
2. Endpoint: `GET /api/flight-cards/{callId}`
3. Interval: 2 seconds
4. Max attempts: 45 (90 seconds total)
5. Stops when: Cards found or timeout

### Hotel Polling
1. Triggered when: "hotel" keyword detected
2. Endpoint: `GET /api/hotel-cards/{callId}`
3. Interval: 2 seconds
4. Max attempts: 45 (90 seconds total)
5. Stops when: Cards found or timeout

## Error Handling

### Backend
- Try-catch for each function
- Returns error message to Vapi
- Logs detailed errors
- Returns proper HTTP status codes

### Frontend
- Try-catch for polling
- Handles network errors
- Shows timeout messages
- Logs to console for debugging

## Integration Points

### With Vapi
- Webhook URL: `https://ngrok_url/webhooks/vapi`
- Functions configured:
  - search_flights (parameters: origin, destination, date)
  - search_hotels (parameters: city)

### Vapi → Backend
- Function calls received at webhook
- Tool call IDs extracted and returned
- Results sent back to Vapi

### Vapi → Frontend
- AI messages captured
- Keywords trigger polling
- Speech-to-text in widget

### Backend → Frontend
- Polling endpoints return cached cards
- Format: JSON with cards array
- Rendered in widget and main UI

