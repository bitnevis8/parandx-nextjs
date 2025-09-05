# راهنمای نهایی حل مشکل Import در Next.js

## ✅ مشکل حل شد!

همه فایل‌ها به‌روزرسانی شدند تا مستقیماً از `config/api` استفاده کنند.

## 🔧 راه‌حل نهایی

### مسیرهای صحیح Import:

```javascript
// برای فایل‌های root level
import { API_ENDPOINTS } from './config/api';

// برای فایل‌های یک سطح پایین
import { API_ENDPOINTS } from '../config/api';

// برای فایل‌های دو سطح پایین
import { API_ENDPOINTS } from '../../config/api';

// برای فایل‌های سه سطح پایین
import { API_ENDPOINTS } from '../../../config/api';
```

## 📋 فایل‌های اصلاح شده

### ✅ API Routes
- `app/api/auth/login/route.js` → `../../../config/api`
- `app/api/auth/logout/route.js` → `../../../config/api`
- `app/api/auth/me/route.js` → `../../../config/api`
- `app/api/auth/resend-email-code/route.js` → `../../../config/api`
- `app/api/auth/register-email/route.js` → `../../../config/api`
- `app/api/auth/verify-email/route.js` → `../../../config/api`

### ✅ Pages
- `app/page.js` → `./config/api`
- `app/experts/page.js` → `../config/api`
- `app/experts/[id]/page.js` → `../../config/api`
- `app/categories/page.js` → `../config/api`
- `app/requests/new/page.js` → `../../config/api`
- `app/location/page.js` → `../config/api`
- `app/location/LocationPageClient.js` → `../config/api`
- `app/location/[slug]/page.js` → `../../config/api`
- `app/location/[slug]/LocationDetailPageClient.js` → `../../config/api`

### ✅ Dashboard
- `app/dashboard/layout.js` → `../config/api`
- `app/dashboard/user/personal-display/page.js` → `../../../config/api`
- `app/dashboard/user/personal-edit/page.js` → `../../../config/api`
- `app/dashboard/expert/page.js` → `../../config/api`
- `app/dashboard/user-management/roles/create/page.js` → `../../../config/api`
- `app/dashboard/user-management/roles/page.js` → `../../config/api`
- `app/dashboard/user-management/roles/[id]/view/page.js` → `../../../config/api`
- `app/dashboard/user-management/users/page.js` → `../../config/api`
- `app/dashboard/user-management/users/create/page.js` → `../../../config/api`
- `app/dashboard/user-management/users/[id]/page.js` → `../../../config/api`
- `app/dashboard/user-management/users/[id]/edit/page.js` → `../../../config/api`
- `app/dashboard/user-management/users/[id]/view/page.js` → `../../../config/api`

### ✅ Components
- `app/components/ui/Specializations.js` → `../../config/api`
- `app/components/ui/ExpertEdit.js` → `../../config/api`
- `app/components/ui/ProfileEdit.js` → `../../config/api`
- `app/components/user/UserList/UserList.js` → `../../../config/api`
- `app/components/LocationNews.js` → `../config/api`
- `app/components/ClassHeader.js` → `../config/api`

## 🧪 تست

```bash
# پاک کردن cache
rm -rf .next

# Build
npm run build

# یا با اسکریپت
npm run test-build
```

## 🎯 نتیجه

حالا همه import ها درست هستند و build باید بدون خطا انجام شود!

## 📝 نکات مهم

1. **فایل `lib/api.js` حذف شد** - دیگر نیازی نیست
2. **همه import ها مستقیماً به `config/api` اشاره می‌کنند**
3. **مسیرهای نسبی بر اساس موقعیت فایل در ساختار پروژه هستند**
4. **Cache Next.js پاک شده است**

## 🔍 عیب‌یابی

اگر هنوز خطا دارید:

1. مطمئن شوید که فایل `app/config/api.js` وجود دارد
2. مسیرهای نسبی را بررسی کنید
3. Cache را پاک کنید: `rm -rf .next`
4. دوباره build کنید: `npm run build`


