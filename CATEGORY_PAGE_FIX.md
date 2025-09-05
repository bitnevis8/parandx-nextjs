# راهنمای حل مشکل صفحه دسته‌بندی

## 🔍 مشکل

خطای `API_ENDPOINTS is not defined` در صفحه دسته‌بندی:
- URL: `http://localhost:3001/categories/building-renovation`
- فایل: `app/categories/[slug]/page.js`

## ✅ راه‌حل

فایل `app/categories/[slug]/page.js` به‌روزرسانی شد تا import `API_ENDPOINTS` را اضافه کند:

```javascript
// قبل
"use client";
import { useEffect, useState, use } from 'react';
import Link from 'next/link';

// بعد
"use client";
import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { API_ENDPOINTS } from '../../config/api';
```

## 📋 بررسی کامل

همه فایل‌هایی که از `API_ENDPOINTS` استفاده می‌کنند، import صحیح دارند:

### ✅ فایل‌های بررسی شده:
- `app/categories/[slug]/page.js` - ✅ اصلاح شد
- `app/categories/page.js` - ✅ درست است
- `app/page.js` - ✅ درست است
- `app/experts/page.js` - ✅ درست است
- `app/experts/[id]/page.js` - ✅ درست است
- `app/requests/new/page.js` - ✅ درست است
- `app/location/page.js` - ✅ درست است
- `app/location/LocationPageClient.js` - ✅ درست است
- `app/location/[slug]/page.js` - ✅ درست است
- `app/location/[slug]/LocationDetailPageClient.js` - ✅ درست است
- `app/dashboard/layout.js` - ✅ درست است
- `app/dashboard/expert/page.js` - ✅ درست است
- `app/dashboard/user/personal-display/page.js` - ✅ درست است
- `app/dashboard/user/personal-edit/page.js` - ✅ درست است
- `app/dashboard/user-management/*` - ✅ درست است
- `app/components/*` - ✅ درست است
- `app/api/auth/*` - ✅ درست است

## 🧪 تست

```bash
# Build پروژه
cd nextjs
npm run build

# یا تست development
npm run dev
```

## 🎯 نتیجه

حالا صفحه دسته‌بندی باید بدون خطا کار کند و اطلاعات دسته‌بندی را به درستی نمایش دهد!

## 📝 نکات مهم

1. **Import صحیح**: همه فایل‌ها باید `API_ENDPOINTS` را import کنند
2. **مسیر صحیح**: import باید از `config/api` باشد
3. **مسیرهای نسبی**: بر اساس موقعیت فایل در ساختار پروژه

## 🔍 عیب‌یابی

اگر هنوز خطا دارید:

1. **بررسی import**: مطمئن شوید که فایل import دارد
2. **بررسی مسیر**: مسیر نسبی باید درست باشد
3. **بررسی cache**: cache Next.js را پاک کنید
4. **بررسی build**: پروژه را دوباره build کنید
