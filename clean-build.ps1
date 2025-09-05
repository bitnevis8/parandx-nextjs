# PowerShell script to clean cache and build Next.js
Write-Host "🧹 پاک کردن cache Next.js..." -ForegroundColor Yellow

# Remove .next directory if it exists
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "✅ Cache پاک شد" -ForegroundColor Green
} else {
    Write-Host "ℹ️ Cache وجود نداشت" -ForegroundColor Blue
}

Write-Host "🔨 شروع Build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build موفق بود!" -ForegroundColor Green
} else {
    Write-Host "❌ Build ناموفق بود" -ForegroundColor Red
}
