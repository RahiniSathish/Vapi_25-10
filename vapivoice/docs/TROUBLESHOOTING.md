# Troubleshooting Guide

## Common Issues & Solutions

### Frontend Issues

#### Issue: Page won't load (blank or error)
**Symptoms:** `http://localhost:5173` shows blank page or error

**Solutions:**
1. Check if frontend is running:
   ```bash
   lsof -i :5173
   ```

2. Clear browser cache:
   - Press `Ctrl+Shift+Delete` (or `Cmd+Shift+Delete` on Mac)
   - Clear all cache for the domain

3. Reinstall dependencies:
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

4. Check console for errors:
   - Press `F12` to open DevTools
   - Look for red errors in Console tab

---

#### Issue: Flight cards not displaying
**Symptoms:** User asks for flights, but no cards appear in widget

**Checklist:**
1. Check frontend console (F12) for these logs in order:
   - `✨✨✨ CHECKING FINAL TRANSCRIPT FOR KEYWORDS`
   - `✈️✈️✈️ FOUND FLIGHT KEYWORD IN TRANSCRIPT - TRIGGERING POLLING!`
   - `🏨 Starting backend polling for flight cards`
   - `📡 Backend response: {success: true, cards: Array(...)}`

2. If polling times out:
   - Check backend is running: `lsof -i :4000`
   - Check backend logs for `SEARCH FLIGHTS FUNCTION CALLED`
   - If not there, verify search_flights is configured in Vapi Dashboard

3. If backend response shows empty cards:
   - Backend never received the function call from Vapi
   - Check ngrok URL is correct: `ngrok http 4000`
   - Verify in Vapi Dashboard: Functions → search_flights → Server URL

---

#### Issue: Hotel cards not displaying
**Symptoms:** User asks for hotels, but no cards appear

**Checklist:**
1. Same as flight cards, but look for:
   - `🏨🏨🏨 FOUND HOTEL KEYWORD IN TRANSCRIPT`
   - `🏨 Starting backend polling for hotel cards`
   - `🏨 Hotel backend response: {success: true, cards: Array(...)}`

2. If polling times out:
   - Verify search_hotels function is configured in Vapi Dashboard
   - Check backend logs show `🏨 SEARCH HOTELS FUNCTION CALLED`

3. Common hotel-specific issues:
   - City name must match database (Riyadh, Jeddah, Al-Ula, Abha, Dammam)
   - Check case-sensitivity in city parameter

---

#### Issue: Cards appear but don't look right (wrong styling)
**Symptoms:** Cards display but colors/layout wrong

**Solutions:**
1. Check browser zoom (should be 100%):
   - Press `Ctrl+0` (or `Cmd+0` on Mac)

2. Clear CSS cache:
   - Press `Ctrl+Shift+R` (hard refresh)

3. Check if CSS file loaded:
   - Press `F12` → Network tab
   - Reload page
   - Look for `App.css` - should be 200 status, not 404

---

### Backend Issues

#### Issue: Backend won't start
**Symptoms:** `python server.py` fails with error

**Solutions:**
1. Check Python version (need 3.8+):
   ```bash
   python --version
   ```

2. Check if port 4000 is already in use:
   ```bash
   lsof -i :4000
   # Kill if needed:
   kill -9 <PID>
   ```

3. Install missing dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Check for syntax errors:
   ```bash
   python -m py_compile backend/server.py
   ```

5. Look at full error message:
   - Error usually shown at bottom of traceback
   - Search error message in Google

---

#### Issue: Backend runs but returns 500 errors
**Symptoms:** Browser console shows `500 (Internal Server Error)`

**Solutions:**
1. Check backend logs for error details:
   - Look for red lines or ERROR level
   - Find line with "Traceback"
   - Read the actual error message

2. Common 500 errors:
   - **"module not found"**: Missing import or dependency
   - **"syntax error"**: Python syntax issue
   - **"database locked"**: bookings.db being used elsewhere
   - **"timeout"**: Operation taking too long

3. Fix based on error:
   - Install missing module: `pip install module_name`
   - Fix syntax in code
   - Close other connections to database
   - Check function parameters

---

#### Issue: Vapi webhook not reaching backend
**Symptoms:** Frontend polling times out, backend logs show nothing

**Checklist:**
1. Verify ngrok is running:
   ```bash
   # Should show active tunnel
   ngrok http 4000
   ```

2. Test ngrok URL directly:
   ```bash
   curl https://YOUR_NGROK_URL/webhooks/vapi
   # Should return 405 Method Not Allowed (POST required)
   ```

3. In Vapi Dashboard:
   - Go to Functions
   - Select search_flights
   - Check Server URL matches ngrok URL
   - Should be: `https://YOUR_NGROK_URL/webhooks/vapi`

4. Test function in Vapi:
   - Click "Test" button
   - Should see request in ngrok logs
   - Backend logs should show `SEARCH FLIGHTS FUNCTION CALLED`

---

#### Issue: Tool call ID mismatch
**Symptoms:** Backend logs show "toolCallId is None"

**Solutions:**
1. Verify function is configured correctly in Vapi
2. Check Vapi is sending proper JSON:
   ```json
   {
     "message": {
       "functionCall": {
         "id": "call_123",  // ← This is the tool call ID
         "name": "search_flights",
         "arguments": {...}
       }
     }
   }
   ```

3. If still failing, enable debug logging in backend

---

### Vapi Configuration Issues

#### Issue: AI not calling search_flights function
**Symptoms:** User asks for flights, AI just talks about flights without calling function

**Solution:** Update Vapi system prompt to explicitly call functions:

In Vapi Dashboard → Alex assistant → System Prompt, add:
```
When the user asks for flights:
1. Say a brief intro about flight search
2. IMMEDIATELY call search_flights() function with proper parameters
3. Wait for cards to display
4. Never output flight details as text

When the user asks for hotels:
1. Say a brief intro about hotel search
2. IMMEDIATELY call search_hotels() function
3. Wait for cards to display
4. Never output hotel details as text
```

---

#### Issue: Function parameters not being sent
**Symptoms:** Backend receives function call but arguments are empty

**Solution:**
1. Check JSON schema in Vapi is correct:
   ```json
   {
     "type": "object",
     "properties": {
       "origin": {"type": "string"},
       "destination": {"type": "string"},
       "date": {"type": "string"}
     },
     "required": ["origin", "destination", "date"]
   }
   ```

2. Check system prompt instructs AI to use parameters:
   ```
   Call: search_flights(origin="Bangalore", destination="Riyadh", date="2025-12-20")
   ```

---

### Polling Issues

#### Issue: Polling starts but times out after 90 seconds
**Symptoms:** Frontend logs show polling attempts 1/45, 2/45, ... 45/45 then stops

**This means backend never cached cards:**
1. Check backend received function call:
   - Backend logs should show `SEARCH FLIGHTS FUNCTION CALLED`
   - If not, check Vapi configuration (see above)

2. If function was called but cards not cached:
   - Check backend logs for errors in search_flights()
   - Backend might have returned error response
   - Cards might not have been found

3. Check cache endpoints:
   ```bash
   curl http://localhost:4000/api/flight-cards/latest
   # Should return either success with cards or failure message
   ```

---

#### Issue: Polling starts then immediately stops
**Symptoms:** One or two poll attempts then stops

**Likely causes:**
1. `isConnected` became false (call ended)
2. `callId` is null or wrong
3. `shouldPollFlights` was set to false

**Solution:**
1. Check frontend logs for:
   - `📞 Call ended` (means call ended too early)
   - `undefined` callId (means call not initialized)

2. Add 3-second grace period in VoiceButton.jsx if not already there
3. Check call-end event fires too early

---

### Network/CORS Issues

#### Issue: CORS error when polling
**Symptoms:** Browser console shows "Access to XMLHttpRequest blocked by CORS"

**Solution:** Backend already has CORS enabled, but check:
1. Backend is running: `lsof -i :4000`
2. Frontend polling uses correct backend URL:
   - Should be `http://localhost:4000/api/...`
   - Not `http://127.0.0.1:4000` (might differ)

---

#### Issue: ngrok connection drops
**Symptoms:** Webhooks stop working after a while

**Solution:**
1. ngrok free plan disconnects after ~2 hours
2. Restart ngrok:
   ```bash
   # Kill old process
   pkill ngrok
   # Start new tunnel
   ngrok http 4000
   ```

3. Update Server URL in Vapi Dashboard with new ngrok URL

---

### Database Issues

#### Issue: "Database is locked" error
**Symptoms:** Backend shows error about bookings.db being locked

**Solution:**
1. Close other connections to database
2. Restart backend:
   ```bash
   # Kill backend process
   pkill -f "python server.py"
   # Wait 5 seconds
   sleep 5
   # Start backend again
   python server.py
   ```

3. If still locked, remove lock file:
   ```bash
   rm bookings.db-journal
   python server.py
   ```

---

## Debug Logging

### Enable Full Logging

**Frontend (VoiceButton.jsx):** Already includes extensive console logs.
Just open Browser DevTools (F12) to see all logs.

**Backend (server.py):** Logs are shown in terminal.
For more detail, check log level is set to INFO.

### Check Specific Flows

**For flight search:**
1. User says "flights from X to Y"
2. Check console for keywords detected
3. Verify polling starts
4. Monitor backend logs for function call

**For hotel search:**
1. User says "hotels in X"
2. Check console for hotel keywords
3. Verify hotel polling starts
4. Monitor backend logs

---

## Performance Tuning

### Slow card display
If cards take >10 seconds to appear:

1. Increase polling timeout:
   - Edit `maxPolls` in VoiceButton.jsx from 45 to 90

2. Reduce poll interval:
   - Edit interval from 2000ms to 1000ms (1 second)
   - Use sparingly as it increases traffic

3. Check backend performance:
   - Time the search_flights() function
   - Optimize database queries
   - Profile with: `python -m cProfile server.py`

### High CPU usage
1. Stop polling after cards found (already implemented)
2. Reduce frontend polling frequency
3. Check for infinite loops in backend

### Memory usage
1. Cache clearing is automatic (already implemented)
2. Monitor hotel_cards_cache size
3. Implement cache size limits if needed

---

## Getting More Help

If issue persists:

1. **Check logs:**
   - Frontend: Press F12, go to Console tab
   - Backend: Check terminal output

2. **Check configuration:**
   - Vapi Dashboard → Functions and System Prompt
   - Server URL matches ngrok URL
   - Parameters schema is correct

3. **Test components individually:**
   - Test ngrok: `curl https://ngrok_url/webhooks/vapi`
   - Test backend polling: `curl http://localhost:4000/api/flight-cards/latest`
   - Test frontend: Visit `http://localhost:5173`

4. **Restart everything:**
   ```bash
   # Kill all processes
   pkill -f "python server.py"
   pkill -f "npm run dev"
   pkill ngrok
   
   # Wait 5 seconds
   sleep 5
   
   # Start fresh
   cd backend && python server.py &
   cd frontend && npm run dev &
   ngrok http 4000
   ```

