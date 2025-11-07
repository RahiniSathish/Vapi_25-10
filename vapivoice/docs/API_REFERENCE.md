# API Reference

## Base URL
- Backend: `http://localhost:4000`
- Frontend: `http://localhost:5173`

## Backend Endpoints

### Vapi Webhooks

#### POST /webhooks/vapi
Handles all Vapi webhook events including function calls.

**Request Body** (example for search_flights):
```json
{
  "message": {
    "functionCall": {
      "id": "call_12345",
      "name": "search_flights",
      "arguments": {
        "origin": "Bangalore",
        "destination": "Riyadh",
        "date": "2025-12-20"
      }
    }
  },
  "call": {
    "id": "call_xyz789"
  }
}
```

**Response** (successful):
```json
{
  "results": [{
    "toolCallId": "call_12345",
    "result": "Found 6 flights from Bangalore to Riyadh",
    "cards": [
      {
        "title": "✈️ Air India Express",
        "subtitle": "6 hours | Depart: 08:00",
        "footer": "💰 ₹26,500 | 1 Stop",
        "buttons": [{"text": "Book Now", "url": "#"}]
      },
      ...
    ]
  }]
}
```

#### POST /tool-calls
Alternative endpoint for Vapi tool-calls webhook (forwards to /webhooks/vapi).

**Same request/response format as /webhooks/vapi**

---

### Flight Cards

#### GET /api/flight-cards/{call_id}
Retrieve cached flight cards for a specific call.

**Parameters:**
- `call_id` (path): Call ID or "latest"

**Response** (success):
```json
{
  "success": true,
  "cards": [
    {
      "title": "✈️ Air India Express",
      "subtitle": "6 hours | Depart: 08:00",
      "footer": "💰 ₹26,500 | 1 Stop",
      "buttons": [{"text": "Book Now", "url": "#"}]
    }
  ],
  "text": "Found 6 flights...",
  "cached_at": 1699564800,
  "age_seconds": 5
}
```

**Response** (not found):
```json
{
  "success": false,
  "cards": [],
  "message": "No cards found for this call_id"
}
```

---

### Hotel Cards

#### GET /api/hotel-cards/{call_id}
Retrieve cached hotel cards for a specific call.

**Parameters:**
- `call_id` (path): Call ID or "latest"

**Response** (success):
```json
{
  "success": true,
  "cards": [
    {
      "title": "🏨 Al Faisaliah Hotel",
      "subtitle": "⭐⭐⭐⭐⭐ Luxury | 📍 Olaya Street, Riyadh",
      "footer": "💰 ₹15,000 | World class amenities...",
      "buttons": [
        {
          "text": "🗺️ View on Google Maps",
          "url": "https://www.google.com/maps/place/Al+Faisaliah+Hotel..."
        }
      ]
    }
  ],
  "text": "Found 6 hotels in Riyadh",
  "cached_at": 1699564800,
  "age_seconds": 3,
  "actual_call_id": "call_xyz789"
}
```

**Response** (not found):
```json
{
  "success": false,
  "cards": [],
  "message": "No hotel cards found for this call_id"
}
```

---

### Cache Management

#### POST /api/clear-cache
Clear all cached flight and hotel cards.

**Request Body:** (optional)
```json
{}
```

**Response:**
```json
{
  "success": true,
  "message": "All caches cleared",
  "cleared": {
    "flights": 5,
    "hotels": 3
  }
}
```

---

## Vapi Function Schemas

### search_flights
Search for flights between two cities.

**Parameters:**
```json
{
  "type": "object",
  "properties": {
    "origin": {
      "type": "string",
      "description": "Departure city (e.g., Bangalore, Delhi, Mumbai)"
    },
    "destination": {
      "type": "string",
      "description": "Arrival city (e.g., Riyadh, Jeddah, Dubai)"
    },
    "date": {
      "type": "string",
      "description": "Travel date in YYYY-MM-DD format"
    }
  },
  "required": ["origin", "destination", "date"]
}
```

**Example Call:**
```
User: "Find flights from Bangalore to Riyadh on December 20"
→ search_flights("Bangalore", "Riyadh", "2025-12-20")
```

---

### search_hotels
Search for hotels in a city.

**Parameters:**
```json
{
  "type": "object",
  "properties": {
    "city": {
      "type": "string",
      "description": "City name: Riyadh, Jeddah, Al-Ula, Abha, or Dammam"
    }
  },
  "required": ["city"]
}
```

**Example Call:**
```
User: "Find hotels in Riyadh"
→ search_hotels("Riyadh")
```

---

## Frontend Events

### From VoiceButton to App

#### flight-card-data
Sent when flight cards are found and should be displayed on main page.

```javascript
window.postMessage({
  type: 'flight-card-data',
  flight: {
    airline: "Air India Express",
    departure: "08:00",
    arrival: "14:00",
    duration: "6 hours",
    stops: 1,
    price: "₹26,500",
    bookUrl: "#"
  }
}, '*');
```

#### hotel-card-data
Sent when hotel cards are found and should be displayed on main page.

```javascript
window.postMessage({
  type: 'hotel-card-data',
  hotel: {
    name: "Al Faisaliah Hotel",
    location: "Al Faisaliah Tower, Olaya Street, Riyadh",
    type: "5-star",
    stars: 5,
    reviews: "World class amenities, exceptional service",
    price: "₹15,000",
    google_maps_url: "https://www.google.com/maps/..."
  }
}, '*');
```

#### call-start
Sent when a new call starts.

```javascript
window.postMessage({
  type: 'call-start'
}, '*');
```

#### call-end
Sent when a call ends.

```javascript
window.postMessage({
  type: 'call-end'
}, '*');
```

---

## Error Codes

### Backend
- `200`: Success
- `400`: Bad request (missing parameters)
- `404`: Not found (no results)
- `500`: Server error

### Frontend Polling
- Timeout after 90 seconds (45 × 2-second intervals)
- Logs message: "POLLING TIMEOUT - Backend never cached cards"

---

## Rate Limiting

Currently no rate limiting implemented. For production, consider:
- Rate limit Vapi webhooks per call
- Rate limit polling requests per frontend session
- Implement request throttling

---

## Cache Behavior

### Cache Duration
- Cards cached in memory during call session
- Cache cleared on:
  - Page load
  - New call start
  - Manual `/api/clear-cache` request

### Cache Lookup
- First checks specific call_id
- Falls back to "latest" if not found
- Returns most recent if "latest" requested

---

## CORS Headers

Backend includes CORS headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## Ngrok Configuration

When using ngrok for local development:

```bash
ngrok http 4000
# Gives URL like: https://1a2b3c4d5e6f.ngrok.io

# Use in Vapi Dashboard:
Server URL: https://1a2b3c4d5e6f.ngrok.io/webhooks/vapi
```

Backend automatically handles both:
- `https://ngrok_url/webhooks/vapi`
- `https://ngrok_url/tool-calls`

