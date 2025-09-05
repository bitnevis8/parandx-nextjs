# راهنمای حل مشکل Build در Next.js

## 🔍 مشکل

خطای `Module not found: Can't resolve '@config/api'` در build time

## 🛠️ راه‌حل‌های ممکن

### 1. پاک کردن Cache

```bash
# Windows Command Prompt
cd nextjs
rmdir /s /q .next
npm run build

# Windows PowerShell
cd nextjs
Remove-Item -Recurse -Force .next
npm run build

# یا استفاده از اسکریپت‌ها
clean-build.bat    # Windows Batch
clean-build.ps1    # Windows PowerShell
```

### 2. بررسی Import ها

مطمئن شوید که همه فایل‌ها از مسیر صحیح import می‌کنند:

```javascript
// ✅ درست
import { API_ENDPOINTS } from '../../lib/api';

// ❌ اشتباه
import { API_ENDPOINTS } from '@config/api';
import { API_ENDPOINTS } from '../../config/api';
```

### 3. بررسی فایل Helper

مطمئن شوید که فایل `app/lib/api.js` وجود دارد:

```javascript
// app/lib/api.js
export { API_ENDPOINTS } from '../config/api';
```

### 4. بررسی مسیرهای نسبی

مسیرهای نسبی باید بر اساس موقعیت فایل در ساختار پروژه باشند:

```
nextjs/
├── app/
│   ├── lib/
│   │   └── api.js          # Helper file
│   ├── config/
│   │   └── api.js          # Original config
│   ├── api/
│   │   └── auth/
│   │       └── me/
│   │           └── route.js # ../../lib/api
│   ├── dashboard/
│   │   └── layout.js       # ../lib/api
│   └── page.js             # ./lib/api
```

## 🧪 تست

```bash
# 1. پاک کردن cache
rm -rf .next  # Linux/Mac
rmdir /s /q .next  # Windows

# 2. Build
npm run build

# 3. تست با اسکریپت
npm run test-build
```

## 🔧 عیب‌یابی

### اگر هنوز خطا دارید:

1. **بررسی فایل‌های مشکل‌دار:**
   ```bash
   grep -r "@config/api" nextjs/app/
   ```

2. **بررسی مسیرهای نسبی:**
   - مطمئن شوید که مسیرهای نسبی درست هستند
   - فایل `app/lib/api.js` وجود دارد

3. **بررسی cache:**
   - cache را کاملاً پاک کنید
   - `node_modules` را هم پاک کنید و دوباره نصب کنید

4. **بررسی Next.js config:**
   - مطمئن شوید که `next.config.mjs` درست است

## 📋 چک‌لیست

- [ ] فایل `app/lib/api.js` وجود دارد
- [ ] همه import ها به `lib/api` اشاره می‌کنند
- [ ] مسیرهای نسبی درست هستند
- [ ] Cache پاک شده است
- [ ] `next.config.mjs` درست است

## 🎯 نتیجه

پس از انجام این مراحل، build باید بدون خطا انجام شود!
