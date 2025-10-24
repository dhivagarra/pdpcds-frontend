# CORS Verification Test for Port 3001

Write-Host "=== Testing CORS for Port 3001 ===" -ForegroundColor Cyan

try {
    # Test with port 3001 origin (where frontend is actually running)
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8000/health" -Method GET -Headers @{"Origin"="http://127.0.0.1:3001"} -UseBasicParsing
    
    Write-Host "✅ Connection Status: $($response.StatusCode)" -ForegroundColor Green
    
    $corsOrigin = $response.Headers["Access-Control-Allow-Origin"]
    if ($corsOrigin -eq "http://127.0.0.1:3001") {
        Write-Host "✅ CORS configured correctly for port 3001" -ForegroundColor Green
        Write-Host "   Access-Control-Allow-Origin: $corsOrigin" -ForegroundColor Gray
        Write-Host "`n🚀 Frontend should now work at http://127.0.0.1:3001" -ForegroundColor White
    } elseif ($corsOrigin -eq "http://127.0.0.1:3000") {
        Write-Host "⚠️  CORS only configured for port 3000" -ForegroundColor Yellow
        Write-Host "   Need to add port 3001 to backend CORS configuration" -ForegroundColor Yellow
        Write-Host "   See CORS_PORT_FIX.md for instructions" -ForegroundColor Yellow
    } else {
        Write-Host "❌ CORS not properly configured" -ForegroundColor Red
        Write-Host "   Access-Control-Allow-Origin: $corsOrigin" -ForegroundColor Gray
    }
    
} catch {
    Write-Host "❌ Connection failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Make sure your backend is running on http://127.0.0.1:8000" -ForegroundColor Yellow
}

Write-Host "`n📝 Instructions:" -ForegroundColor White
Write-Host "1. Update backend CORS to include http://127.0.0.1:3001" -ForegroundColor Gray
Write-Host "2. Restart your FastAPI backend server" -ForegroundColor Gray
Write-Host "3. Run this test again to verify" -ForegroundColor Gray
Write-Host "4. Test your frontend at http://127.0.0.1:3001" -ForegroundColor Gray