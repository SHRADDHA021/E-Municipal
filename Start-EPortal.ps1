# Stop any existing processes
Stop-Process -Name "EPortalApi" -Force -ErrorAction SilentlyContinue
Get-Process | Where-Object { $_.ProcessName -eq "node" } | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "🚀 Starting E-Municipal Portal..." -ForegroundColor Cyan

# Start Backend
Write-Host "📂 Starting Backend API..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd eportal-api; dotnet run"

# Wait for backend
Start-Sleep -Seconds 10

# Start Frontend
Write-Host "💻 Starting Frontend Web..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd eportal-web; npm run dev"

Write-Host "✅ Services starting..." -ForegroundColor White
Write-Host "Admin: admin@emunicipal.com / Admin@1234"
Write-Host "Employee: employee@emunicipal.com / Emp@1234"
Write-Host "Citizen: citizen@emunicipal.com / Cit@1234"
