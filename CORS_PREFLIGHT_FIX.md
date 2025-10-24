# 🚨 CORS Preflight Issue Diagnosis & Fix

## Problem Identified
The frontend Disease Prediction form works in Postman but fails in the browser with "Network Error". This is a classic **CORS preflight issue**.

## Root Cause
When the browser makes a POST request with `Content-Type: application/json`, it first sends an **OPTIONS preflight request** to check if the cross-origin request is allowed. Your backend might not be properly handling these OPTIONS requests for the `/api/v1/predict/` endpoint.

## Backend Fix Required

**File to Edit:** `c:\Users\Babu\Documents\WORKAREA\pdpcds-project\app\main.py`

**Current Issue:** The CORS middleware needs to explicitly allow OPTIONS requests and handle preflight properly.

**Fix 1: Update CORS Configuration**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:3000", 
        "http://localhost:3000",
        "http://127.0.0.1:3001",  # Your frontend port
        "http://localhost:3001"
    ],
    allow_credentials=False,  # Set to False for better compatibility
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Explicitly include OPTIONS
    allow_headers=["*"],
    expose_headers=["*"]  # Add this line
)
```

**Fix 2: Add Explicit OPTIONS Handler (Alternative)**
```python
from fastapi import FastAPI
from fastapi.responses import Response

@app.options("/api/v1/predict/")
async def prediction_options():
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Accept",
        }
    )
```

## Quick Test Commands

**Test 1: Check if OPTIONS is working**
```powershell
# This should return 200, not 405 Method Not Allowed
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/predict/" -Method OPTIONS
```

**Test 2: Test with explicit CORS headers**
```powershell
$headers = @{
    'Content-Type' = 'application/json'
    'Origin' = 'http://127.0.0.1:3001'
    'Access-Control-Request-Method' = 'POST'
    'Access-Control-Request-Headers' = 'content-type'
}

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/predict/" -Method OPTIONS -Headers $headers
```

## Steps to Fix

1. **Update Backend CORS Configuration:**
   - Edit `app/main.py`
   - Use the updated CORS configuration above
   - Make sure `allow_methods` includes `"OPTIONS"`

2. **Restart Backend Server:**
   ```bash
   cd c:\Users\Babu\Documents\WORKAREA\pdpcds-project
   # Stop current server (Ctrl+C)
   .\.venv\Scripts\uvicorn.exe app.main:app --reload
   ```

3. **Test OPTIONS Request:**
   - Run the test commands above
   - OPTIONS should return 200, not 405

4. **Test Frontend:**
   - Refresh your frontend
   - Try submitting the prediction form again

## Browser Dev Tools Debug

Open browser DevTools (F12) → Network tab → Try the prediction request:
- Look for a **preflight OPTIONS request** before the POST
- Check if the OPTIONS request is failing (red)
- Check the response headers for CORS headers

## Expected Behavior After Fix

1. ✅ OPTIONS preflight request returns 200
2. ✅ POST request succeeds after preflight
3. ✅ Frontend prediction form works without "Network Error"

## If Still Not Working

Try this simplified frontend test in browser console:
```javascript
fetch('http://127.0.0.1:8000/api/v1/predict/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    age: 42,
    sex: "male",
    symptom_list: ["fever"]
  })
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

The most likely fix is **Fix 1** - updating the CORS configuration to explicitly include OPTIONS method.