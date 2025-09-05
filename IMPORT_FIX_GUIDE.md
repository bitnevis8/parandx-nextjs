# راهنمای حل مشکل Import در Next.js

## 🔍 تشخیص مشکل

خطای شما مربوط به مسیرهای import نادرست برای فایل `config/api` است:

```
Module not found: Can't resolve '../../../../../config/api'
```

## 🛠️ راه‌حل اعمال شده

### 1. اضافه کردن Webpack Alias

در فایل `next.config.mjs` alias اضافه شد:

```javascript
webpack: (config, { dev, isServer }) => {
  // اضافه کردن alias برای مسیر config
  config.resolve.alias = {
    ...config.resolve.alias,
    '@config': require('path').resolve(__dirname, 'app/config'),
  };
  // ...
}
```

### 2. اصلاح تمام Import ها

تمام فایل‌هایی که `config/api` را import می‌کردند به `@config/api` تغییر یافتند:

**قبل:**
```javascript
import { API_ENDPOINTS } from '../../../../../config/api';
```

**بعد:**
```javascript
import { API_ENDPOINTS } from '@config/api';
```

## 📋 فایل‌های اصلاح شده

### API Routes
- `app/api/auth/login/route.js`
- `app/api/auth/logout/route.js`
- `app/api/auth/me/route.js`
- `app/api/auth/resend-email-code/route.js`
- `app/api/auth/register-email/route.js`
- `app/api/auth/verify-email/route.js`

### Dashboard Pages
- `app/dashboard/layout.js`
- `app/dashboard/user-management/roles/create/page.js`
- `app/dashboard/user-management/roles/page.js`
- `app/dashboard/user-management/roles/[id]/view/page.js`
- `app/dashboard/user-management/users/page.js`
- `app/dashboard/user-management/users/create/page.js`
- `app/dashboard/user-management/users/[id]/page.js`
- `app/dashboard/user-management/users/[id]/edit/page.js`
- `app/dashboard/user-management/users/[id]/view/page.js`
- `app/dashboard/user/personal-display/page.js`
- `app/dashboard/user/personal-edit/page.js`
- `app/dashboard/expert/page.js`

### Components
- `app/components/ui/Specializations.js`
- `app/components/ui/ExpertEdit.js`
- `app/components/ui/ProfileEdit.js`
- `app/components/user/UserList/UserList.js`
- `app/components/LocationNews.js`
- `app/components/ClassHeader.js`

### Pages
- `app/page.js`
- `app/experts/page.js`
- `app/experts/[id]/page.js`
- `app/categories/page.js`
- `app/requests/new/page.js`
- `app/location/page.js`
- `app/location/LocationPageClient.js`
- `app/location/[slug]/page.js`
- `app/location/[slug]/LocationDetailPageClient.js`

## 🧪 تست

```bash
# تست build
npm run test-build

# یا build مستقیم
npm run build
```

## ✅ مزایای این راه‌حل

1. **یکسان‌سازی**: همه فایل‌ها از یک مسیر یکسان استفاده می‌کنند
2. **قابلیت نگهداری**: تغییر مسیر config فقط در یک جا نیاز است
3. **خوانایی**: مسیرهای import کوتاه‌تر و واضح‌تر هستند
4. **پایداری**: کمتر احتمال خطا در مسیرهای نسبی

## 🔧 تنظیمات اضافی

اگر در آینده نیاز به اضافه کردن alias های دیگر داشتید:

```javascript
config.resolve.alias = {
  ...config.resolve.alias,
  '@config': require('path').resolve(__dirname, 'app/config'),
  '@components': require('path').resolve(__dirname, 'app/components'),
  '@utils': require('path').resolve(__dirname, 'app/utils'),
  // ...
};
```

## 📞 پشتیبانی

در صورت بروز مشکل:
1. مطمئن شوید که `next.config.mjs` درست تنظیم شده
2. بررسی کنید که همه import ها به `@config/api` تغییر یافته‌اند
3. cache Next.js را پاک کنید: `rm -rf .next`
4. دوباره build کنید: `npm run build`
