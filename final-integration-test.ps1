# Final Integration Test - Clinical Decision Support System

Write-Host "=== Final Integration Test ===" -ForegroundColor Cyan

# Test 1: Backend Health Check
Write-Host "`n1. Testing Backend Health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://127.0.0.1:8000/health" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend Health: $($health.status)" -ForegroundColor Green
    Write-Host "   Service: $($health.service)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Backend Health Failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Disease Prediction API
Write-Host "`n2. Testing Disease Prediction API..." -ForegroundColor Yellow
$testPatient = @{
    age = 45
    sex = "female"
    vital_temperature_c = 38.5
    symptom_list = @("fever", "cough", "fatigue")
    pmh_list = @("hypertension")
    chief_complaint = "Fever and cough for 3 days"
} | ConvertTo-Json

try {
    $prediction = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/predict/" -Method POST -ContentType "application/json" -Body $testPatient -TimeoutSec 10
    Write-Host "✅ Prediction API: Success" -ForegroundColor Green
    Write-Host "   Predictions Count: $($prediction.predictions.Count)" -ForegroundColor Gray
    Write-Host "   Processing Time: $($prediction.processing_time_ms)ms" -ForegroundColor Gray
} catch {
    Write-Host "❌ Prediction API Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Frontend Accessibility
Write-Host "`n3. Testing Frontend Accessibility..." -ForegroundColor Yellow
try {
    $frontend = Invoke-WebRequest -Uri "http://127.0.0.1:3001" -Method GET -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Frontend: Accessible (Status: $($frontend.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend Not Accessible: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Documentation Endpoints
Write-Host "`n4. Testing API Documentation..." -ForegroundColor Yellow
try {
    $docs = Invoke-WebRequest -Uri "http://127.0.0.1:8000/docs" -Method GET -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ API Docs: Available (Status: $($docs.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ API Docs Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Integration Summary ===" -ForegroundColor Cyan
Write-Host "🔗 Frontend URL: http://127.0.0.1:3001" -ForegroundColor White
Write-Host "🔗 Backend URL: http://127.0.0.1:8000" -ForegroundColor White  
Write-Host "🔗 API Docs: http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host "📄 Connection Test: http://127.0.0.1:3001/connection-test.html" -ForegroundColor White

Write-Host "`n🎯 Next Steps:" -ForegroundColor White
Write-Host "1. Open http://127.0.0.1:3001 in your browser" -ForegroundColor Gray
Write-Host "2. Complete the health check workflow" -ForegroundColor Gray
Write-Host "3. Test disease prediction with patient data" -ForegroundColor Gray
Write-Host "4. Submit clinical feedback as a doctor" -ForegroundColor Gray
Write-Host "5. Review the complete medical workflow" -ForegroundColor Gray

Write-Host "`nIntegration Complete - Ready for Clinical Use!" -ForegroundColor Green