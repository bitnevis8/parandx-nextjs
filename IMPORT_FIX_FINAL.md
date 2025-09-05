# راهنمای نهایی حل مشکل Import در Next.js

## 🔍 مشکل اصلی

خطای `Module not found: Can't resolve '@config/api'` به دلیل عدم پشتیبانی Next.js از alias های webpack در build time بود.

## 🛠️ راه‌حل نهایی

### 1. ایجاد فایل Helper

فایل `app/lib/api.js` ایجاد شد که API_ENDPOINTS را re-export می‌کند:

```javascript
// app/lib/api.js
export { API_ENDPOINTS } from '../config/api';
```

### 2. اصلاح تمام Import ها

تمام فایل‌ها به‌روزرسانی شدند تا از مسیرهای نسبی صحیح استفاده کنند:

**قبل:**
```javascript
import { API_ENDPOINTS } from '@config/api';
```

**بعد:**
```javascript
import { API_ENDPOINTS } from './lib/api';        // برای فایل‌های root
import { API_ENDPOINTS } from '../lib/api';       // برای فایل‌های یک سطح پایین
import { API_ENDPOINTS } from '../../lib/api';    // برای فایل‌های دو سطح پایین
// و غیره...
```

## 📋 فایل‌های اصلاح شده

### Root Level
- `app/page.js` → `./lib/api`

### API Routes
- `app/api/auth/*` → `../../lib/api`

### Dashboard
- `app/dashboard/layout.js` → `../lib/api`
- `app/dashboard/user/*` → `../../../lib/api`
- `app/dashboard/expert/page.js` → `../../lib/api`
- `app/dashboard/user-management/*` → `../../lib/api` یا `../../../lib/api`

### Components
- `app/components/*` → `../lib/api` یا `../../lib/api`

### Pages
- `app/experts/*` → `../lib/api` یا `../../lib/api`
- `app/categories/page.js` → `../lib/api`
- `app/requests/*` → `../../lib/api`
- `app/location/*` → `../lib/api` یا `../../lib/api`

## 🧪 تست

```bash
# تست build
cd nextjs
npm run build

# یا با اسکریپت
npm run test-build
```

## ✅ مزایای این راه‌حل

1. **سازگاری**: با Next.js کاملاً سازگار است
2. **سادگی**: نیازی به تنظیمات پیچیده webpack نیست
3. **قابلیت نگهداری**: تغییر مسیر config فقط در یک فایل نیاز است
4. **پایداری**: کمتر احتمال خطا در build time

## 🔧 ساختار نهایی

```
nextjs/
├── app/
│   ├── lib/
│   │   └── api.js          # Helper file
│   ├── config/
│   │   └── api.js          # Original config
│   ├── components/
│   ├── dashboard/
│   ├── api/
│   └── ...
```

## 📞 عیب‌یابی

اگر هنوز خطا دارید:

1. **Cache پاک کنید:**
   ```bash
   rm -rf .next
   npm run build
   ```

2. **مسیرها را بررسی کنید:**
   - مطمئن شوید که `app/lib/api.js` وجود دارد
   - مسیرهای نسبی را بررسی کنید

3. **Import ها را چک کنید:**
   - همه import ها باید به `lib/api` اشاره کنند
   - نه به `@config/api` یا `config/api`

## 🎯 نتیجه

حالا پروژه شما باید بدون خطا build شود و همه import ها به درستی کار کنند!
