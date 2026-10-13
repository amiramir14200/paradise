# راهنمای جامع انتقال و راه‌اندازی آکادمی پارادایس روی هاست شخصی

این راهنما گام‌به‌گام به شما آموزش می‌دهد که چطور وب‌سایت آکادمی پارادایس (Paradise Academy) را به همراه سیستم احراز هویت، کلاس‌های آنلاین، دوره‌ها و درگاه پرداخت آنلاین/کارت‌به‌کارت روی هاست یا سرور خود منتقل و فعال کنید.

---

## 📦 محتوای آماده شده برای انتقال

تمام فایل‌های پروژه با بیلد نهایی در دو فرمت زیر فشرده شده‌اند:
1. `paradise-academy-production.zip` (مناسب هاست‌های اشتراکی cPanel و DirectAdmin یا دانلود از مرورگر)
2. `paradise-academy-production.tar.gz` (مناسب سرورهای مجازی Linux VPS)

این فایل‌ها شامل فرانت‌اند کامپایل شده (`dist/`)، بک‌اند اجرایی (`server.js`)، کانفیگ داکر (`Dockerfile` و `docker-compose.yml`)، کانفیگ پروسس منیجر (`ecosystem.config.cjs`) و نمونه تنظیمات Nginx (`nginx.conf`) هستند.

---

## روش ۱: استقرار روی هاست اشتراکی cPanel (با Setup Node.js App)

بیشتر هاست‌های ایرانی و خارجی قابلیت **Setup Node.js App** را در سی‌پنل دارند:

### مرحله ۱: آپلود فایل‌ها
1. وارد کنترل پنل **cPanel** هاست خود شوید.
2. به بخش **File Manager** بروید.
3. در پوشه ریشه دامنه خود (معمولاً یک پوشه اختصاصی مثل `/home/username/paradise-app` یا درون `public_html`) فایل `paradise-academy-production.zip` را آپلود کنید.
4. روی فایل زیپ کلیک راست کرده و گزینه **Extract** را بزنید تا فایل‌ها از حالت فشرده خارج شوند.

### مرحله ۲: ایجاد برنامه Node.js
1. در صفحه اصلی cPanel به بخش **Software** رفته و روی **Setup Node.js App** کلیک کنید.
2. روی دکمه **Create Application** کلیک کنید.
3. تنظیمات را به شکل زیر پر کنید:
   - **Node.js version**: نسخه `18` یا `20` یا `22` (ترجیحاً ۲۰)
   - **Application mode**: `Production`
   - **Application root**: مسیر پوشه‌ای که فایل‌ها را در آن اکسترکت کردید (مثلاً `paradise-app`)
   - **Application URL**: دامنه یا ساب‌دامنه شما (مثلاً `academy.yourdomain.ir`)
   - **Application startup file**: بنویسید: `server.js`
4. روی دکمه **Create** کلیک کنید.

### مرحله ۳: نصب پکیج‌ها و متغیرها
1. در بالای صفحه روی **Run NPM Install** کلیک کنید تا وابستگی‌ها خودکار نصب شوند.
2. در بخش **Environment variables** متغیرهای زیر را اضافه کنید:
   - `NODE_ENV`: `production`
   - `PORT`: (پورت پیش‌فرض یا ۳۰۰۰)
   - `APP_URL`: آدرس کامل سایت (مثلاً `https://academy.yourdomain.ir`)
   - `ZARINPAL_MERCHANT_ID`: کد مرچنت زرین‌پال شما
   - `ZARINPAL_SANDBOX`: `false` (یا `true` برای تست)
3. دکمه **Restart** را بزنید. سایت شما بالا آمد!

---

## روش ۲: استقرار روی پلتفرم‌های ابری (لیارا - Liara / هم‌روش - Hamravesh)

پلتفرم‌های PaaS ساده‌ترین و پایدارترین روش در هاستینگ ایران هستند:

### استقرار روی لیارا (Liara):
1. در سایت [liara.ir](https://liara.ir) یک برنامه با پلتفرم **NodeJS** بسازید.
2. نرم‌افزار Liara CLI را در سیستم خود نصب کنید (`npm i -g @liara/cli`) یا فایل زیپ را از طریق پنل آپلود کنید.
3. در فایل `liara.json` یا پنل کاربری لیارا:
   - **دستور اجرا (Start Command)**: `node server.js`
   - **پورت (Port)**: `3000`
4. در بخش متغیرهای محیطی در پنل لیارا، مقادیر زیر را تنظیم کنید:
   - `PORT=3000`
   - `APP_URL=https://your-app.liara.run`
   - `ZARINPAL_MERCHANT_ID=کد_زرین_پال`
   - `ZARINPAL_SANDBOX=false`
5. دکمه استقرار را بزنید. برنامه در کمتر از ۳۰ ثانیه بالا می‌آید.

---

## روش ۳: استقرار روی سرور مجازی لینوکس (Ubuntu VPS) با PM2 و Nginx

این حرفه‌ای‌ترین روش برای ترافیک بالا و مدیریت مستقیم سرور است:

### مرحله ۱: اتصال به سرور و نصب پیش‌نیازها
با SSH به سرور متصل شوید:
```bash
ssh root@YOUR_SERVER_IP
```

نصب Node.js 20 و ابزارها:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx git
sudo npm install -g pm2
```

### مرحله ۲: آپلود و اکسترکت پروژه
فایل `paradise-academy-production.tar.gz` را به سرور منتقل کرده و اکسترکت کنید:
```bash
mkdir -p /var/www/paradise-academy
cd /var/www/paradise-academy
# فایل را در این مسیر قرار دهید و سپس:
tar -xzvf /path/to/paradise-academy-production.tar.gz -C .
```

نصب پکیج‌های پروداکشن:
```bash
npm install --omit=dev
```

### مرحله ۳: تنظیم فایل متغیرها (.env)
یک کپی از فایل نمونه بسازید:
```bash
cp .env.production.example .env
nano .env
```
مقادیر `APP_URL` و `ZARINPAL_MERCHANT_ID` را وارد کرده و با `Ctrl+O` و `Ctrl+X` ذخیره کنید.

### مرحله ۴: اجرای برنامه با PM2
```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```
برنامه در پس‌زمینه اجرا می‌شود و در صورت ری‌استارت سرور، خودکار روشن خواهد شد.

### مرحله ۵: تنظیم Nginx و SSL
فایل کانفیگ نمونه Nginx موجود در پروژه را کپی کنید:
```bash
sudo cp nginx.conf /etc/nginx/sites-available/paradise-academy
sudo sed -i 's/yourdomain.com/دامنه_شما.ir/g' /etc/nginx/sites-available/paradise-academy
sudo ln -s /etc/nginx/sites-available/paradise-academy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

برای فعال‌سازی گواهی رایگان SSL (HTTPS):
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d دامنه_شما.ir -d www.دامنه_شما.ir
```

---

## روش ۴: استقرار با داکر (Docker & Docker Compose)

اگر روی سرور خود Docker دارید، کل سامانه با ۱ دستور اجرا می‌شود:

```bash
# ۱. رفتن به پوشه پروژه
cd paradise-academy

# ۲. ایجاد فایل .env با تنظیمات شخصی
cp .env.production.example .env

# ۳. اجرای کانتینر
docker compose up -d --build
```
سایت روی پورت ۳۰۰۰ به صورت خودکار روشن می‌شود.

---

## 💳 تنظیم درگاه پرداخت زرین‌پال روی دامنه جدید

1. وارد پنل کاربری خود در [زرین‌پال](https://next.zarinpal.com) شوید.
2. به بخش **درگاه‌های پرداخت** بروید و دامنه جدید خود را ثبت نمایید (مثلاً `https://yourdomain.ir`).
3. کد مرچنت (Merchant ID) اختصاص داده شده به دامنه را کپی کنید.
4. در فایل `.env` هاست خود قرار دهید:
   ```env
   ZARINPAL_MERCHANT_ID="کد-مرچنت-۳۶-رقمی-شما"
   ZARINPAL_SANDBOX=false
   APP_URL="https://yourdomain.ir"
   ```
5. آدرس بازگشت (Callback URL) به صورت خودکار توسط برنامه تنظیم می‌شود:
   `https://yourdomain.ir/api/payments/online/callback`
   و کاربر پس از پرداخت بانکی، مستقیماً به صفحه رسید خرید همراه با فعال‌سازی آنی دوره هدایت می‌شود.

---

## 🛠 بازسازی (Rebuild) پروژه در صورت ویرایش کدها
اگر بعداً کدهای سورس داخل پوشه `src/` را در هاست یا لوکال تغییر دادید، کافیست دستور زیر را اجرا کنید:
```bash
npm run build
```
این دستور همزمان فرانت‌اند Vite را در `dist/` و سرور Express را در `server.js` بازسازی می‌کند.
سپس کافیست سرور را ری‌استارت نمایید (`pm2 restart paradise-academy` یا ری‌استارت در cPanel).
