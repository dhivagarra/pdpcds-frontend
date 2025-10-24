# Database Health Test Script

Write-Host "=== Testing Database Health Fix ===" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/health/database" -Method GET -TimeoutSec 10
    
    if ($response.status -eq "healthy" -and $response.database_status -eq "connected") {
        Write-Host "✅ Database Health: FIXED!" -ForegroundColor Green
        Write-Host "   Status: $($response.status)" -ForegroundColor Gray
        Write-Host "   Database: $($response.database_status)" -ForegroundColor Gray
        Write-Host "   Type: $($response.database_type)" -ForegroundColor Gray
        if ($response.tables_count) {
            Write-Host "   Tables: $($response.tables_count)" -ForegroundColor Gray
        }
        Write-Host "   Timestamp: $($response.timestamp)" -ForegroundColor Gray
    }
    elseif ($response.status -eq "unhealthy") {
        Write-Host "❌ Database Health: Still Issues" -ForegroundColor Red
        Write-Host "   Error: $($response.error)" -ForegroundColor Yellow
        Write-Host "`n🔧 Fix needed in backend:" -ForegroundColor Yellow
        Write-Host "   1. Add: from sqlalchemy import text" -ForegroundColor Gray
        Write-Host "   2. Change: SELECT 1 to text('SELECT 1')" -ForegroundColor Gray  
        Write-Host "   3. Restart backend server" -ForegroundColor Gray
    }
    else {
        Write-Host "⚠️  Unexpected response:" -ForegroundColor Yellow
        Write-Host ($response | ConvertTo-Json -Depth 3) -ForegroundColor Gray
    }
    
} catch {
    Write-Host "❌ Cannot connect to database health endpoint" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "   Make sure backend is running on http://127.0.0.1:8000" -ForegroundColor Gray
}

Write-Host "`nℹ️  Instructions:" -ForegroundColor White
Write-Host "   This is a SQLAlchemy 2.0 compatibility issue" -ForegroundColor Gray
Write-Host "   See DATABASE_HEALTH_FIX.md for complete solution" -ForegroundColor Gray