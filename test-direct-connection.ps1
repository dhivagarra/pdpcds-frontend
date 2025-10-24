# Test script to verify backend connection without proxy
$env_file = ".\.env"

Write-Host "=== Testing Direct Backend Connection (No Proxy) ===" -ForegroundColor Cyan

# Read environment variables
if (Test-Path $env_file) {
    Write-Host "Found .env file" -ForegroundColor Green
    $env_content = Get-Content $env_file
    $api_base_url = ($env_content | Where-Object { $_ -match "^VITE_API_BASE_URL=" }) -replace "VITE_API_BASE_URL=", ""
    Write-Host "API Base URL: $api_base_url" -ForegroundColor Yellow
} else {
    $api_base_url = "http://127.0.0.1:8000"
    Write-Host "No .env file found, using default: $api_base_url" -ForegroundColor Yellow
}

Write-Host "`n1. Testing Basic Health Endpoint..." -ForegroundColor White
try {
    $health_response = Invoke-RestMethod -Uri "$api_base_url/health" -Method GET -TimeoutSec 10
    Write-Host "Health Check: $($health_response.status)" -ForegroundColor Green
    Write-Host "   Message: $($health_response.message)" -ForegroundColor Gray
} catch {
    Write-Host "Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n2. Testing Detailed Health Endpoint..." -ForegroundColor White
try {
    $detailed_health = Invoke-RestMethod -Uri "$api_base_url/api/v1/health/" -Method GET -TimeoutSec 10
    Write-Host "Detailed Health: $($detailed_health.status)" -ForegroundColor Green
    Write-Host "   Timestamp: $($detailed_health.timestamp)" -ForegroundColor Gray
} catch {
    Write-Host "Detailed Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n3. Testing Database Health Endpoint..." -ForegroundColor White
try {
    $db_health = Invoke-RestMethod -Uri "$api_base_url/api/v1/health/database" -Method GET -TimeoutSec 10
    Write-Host "Database Health: $($db_health.status)" -ForegroundColor Green
    Write-Host "   Database: $($db_health.database_status)" -ForegroundColor Gray
} catch {
    Write-Host "Database Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Frontend Access Information ===" -ForegroundColor Cyan
Write-Host "Frontend URL: http://127.0.0.1:3001" -ForegroundColor Yellow
Write-Host "Backend URL: $api_base_url" -ForegroundColor Yellow
Write-Host "API Docs: $api_base_url/docs" -ForegroundColor Yellow

Write-Host "`nConfiguration Summary:" -ForegroundColor White
Write-Host "   Environment variables configured in .env file" -ForegroundColor Green
Write-Host "   Direct API connection (no proxy)" -ForegroundColor Green
Write-Host "   SQLite database configuration" -ForegroundColor Green
Write-Host "   CORS should be handled by backend FastAPI settings" -ForegroundColor Green