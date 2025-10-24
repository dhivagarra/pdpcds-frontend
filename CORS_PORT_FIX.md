# URGENT: CORS Fix for Port 3001

## 🚨 **Problem Identified**
Your frontend is running on **port 3001** but your backend CORS is configured for **port 3000**.

## 🔧 **Solution: Update Backend CORS Configuration**

### **Step 1: Locate Your Backend CORS Configuration**

In your backend project (`C:\Users\Babu\Documents\WORKAREA\pdpcds-project`), find the file `app\main.py` and look for the CORS middleware configuration.

### **Step 2: Update CORS to Allow Port 3001**

**Current CORS (only allows port 3000):**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)
```

**Updated CORS (allows both ports):**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:3000",   # Original port
        "http://localhost:3000",
        "http://127.0.0.1:3001",   # Current frontend port
        "http://localhost:3001"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)
```

### **Step 3: Restart Your Backend**

After updating the CORS configuration:
1. **Stop** your FastAPI backend server (Ctrl+C)
2. **Start** it again
3. Verify it's running on http://127.0.0.1:8000

### **Step 4: Test the Fix**

Run this PowerShell command to verify CORS for port 3001:
```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:8000/health" -Headers @{"Origin"="http://127.0.0.1:3001"} -UseBasicParsing | Select-Object StatusCode, @{Name="CORS"; Expression={$_.Headers["Access-Control-Allow-Origin"]}}
```

You should see:
- StatusCode: 200
- CORS: http://127.0.0.1:3001

## 🚀 **Alternative Quick Fix: Force Frontend to Port 3000**

If you prefer to keep backend CORS as-is, you can force the frontend to use port 3000:

### **Update vite.config.ts:**
```typescript
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  server: {
    port: 3000,        // Force specific port
    host: '127.0.0.1',
    cors: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})
```

Then restart your frontend: `npm run dev`

## ✅ **Recommended Solution: Update Backend CORS**

The recommended approach is to update the backend CORS to support both ports (3000 and 3001) since port conflicts are common during development.

**After applying the CORS fix, your frontend at http://127.0.0.1:3001 should connect successfully to the backend!**