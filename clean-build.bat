@echo off
echo 🧹 پاک کردن cache Next.js...

if exist .next (
    rmdir /s /q .next
    echo ✅ Cache پاک شد
) else (
    echo ℹ️ Cache وجود نداشت
)

echo 🔨 شروع Build...
npm run build

if %errorlevel% equ 0 (
    echo ✅ Build موفق بود!
) else (
    echo ❌ Build ناموفق بود
)
