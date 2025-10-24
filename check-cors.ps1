# CORS Headers Check Script
Write-Host "=== Checking CORS Configuration ===" -ForegroundColor Cyan

try {
    # Make request with Origin header to simulate browser CORS request
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8000/health" -Method GET -Headers @{"Origin"="http://127.0.0.1:3000"} -UseBasicParsing
    
    Write-Host "`nResponse Status: $($response.StatusCode)" -ForegroundColor Green
    
    # Check for CORS headers
    $corsHeaders = @(
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Methods", 
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Credentials"
    )
    
    $corsFound = $false
    
    Write-Host "`nCORS Headers Check:" -ForegroundColor Yellow
    foreach ($header in $corsHeaders) {
        if ($response.Headers[$header]) {
            Write-Host "✅ $header : $($response.Headers[$header])" -ForegroundColor Green
            $corsFound = $true
        } else {
            Write-Host "❌ $header : Not found" -ForegroundColor Red
        }
    }
    
    if ($corsFound) {
        Write-Host "`n✅ CORS is configured! Your frontend should work." -ForegroundColor Green
    } else {
        Write-Host "`n❌ CORS is NOT configured. You need to add CORS middleware to your backend." -ForegroundColor Red
        Write-Host "See BACKEND_CORS_SETUP.md for instructions." -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Error connecting to backend: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure your backend is running on http://127.0.0.1:8000" -ForegroundColor Yellow
}

Write-Host "`nNext Steps:" -ForegroundColor White
Write-Host "1. If CORS headers are missing, add CORS middleware to your FastAPI backend" -ForegroundColor Gray
Write-Host "2. Restart your backend after adding CORS" -ForegroundColor Gray  
Write-Host "3. Test your frontend at http://127.0.0.1:3000" -ForegroundColor Gray