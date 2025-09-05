# راهنمای تنظیم محیط برای ParandX

## متغیرهای محیطی مورد نیاز

### Development Environment
برای محیط development، متغیرهای زیر را در فایل `.env.local` تنظیم کنید:

```bash
# API Configuration (Development)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Site Configuration (Development)
NEXT_PUBLIC_SITE_URL=http://localhost:3001

# Environment
NODE_ENV=development
```

### Production Environment
برای محیط production، متغیرهای زیر را در فایل `.env.local` تنظیم کنید:

```bash
# API Configuration (Production)
NEXT_PUBLIC_API_URL=https://api.parandx.com

# Site Configuration (Production)
NEXT_PUBLIC_SITE_URL=https://parandx.com

# Environment
NODE_ENV=production
```

## تنظیمات سرور

### API Server (Node.js)

#### Development
- **Domain**: `localhost`
- **Port**: `3000`
- **Protocol**: HTTP
- **CORS**: تنظیم شده برای `localhost:3001`

#### Production
- **Domain**: `api.parandx.com`
- **Port**: `80` (HTTP) یا `443` (HTTPS)
- **SSL**: فعال
- **CORS**: تنظیم شده برای `parandx.com`

### Frontend Server (Next.js)

#### Development
- **Domain**: `localhost`
- **Port**: `3001`
- **API Endpoint**: `http://localhost:3000`

#### Production
- **Domain**: `parandx.com`
- **Port**: `80` (HTTP) یا `443` (HTTPS)
- **API Endpoint**: `https://api.parandx.com`

## تست اتصال

### Development
```bash
# تست API در development
curl -X GET http://localhost:3000/health

# تست با اسکریپت
cd api && npm run test-connection
```

### Production
```bash
# تست API در production
curl -X GET https://api.parandx.com/health

# تست با اسکریپت
cd api && NODE_ENV=production npm run test-connection
```

## نکات مهم

1. در development از پورت‌های محلی استفاده می‌شود
2. در production از دامنه‌های کامل بدون پورت استفاده می‌شود
3. مطمئن شوید که SSL certificate برای دامنه‌های production معتبر است
4. فایروال سرور باید پورت‌های مناسب را باز کند
5. CORS تنظیم شده تا فقط دامنه‌های مجاز دسترسی داشته باشند
