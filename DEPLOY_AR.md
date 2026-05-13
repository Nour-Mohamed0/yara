# دليل تشغيل المشروع على Cloudflare Pages (مختصر وشامل)

هذا الدليل يشرح الخطوات الدقيقة لتشغيل موقعك على Cloudflare مع ربط قاعدة البيانات ونظام اليوتيوب.

## 1. المتطلبات الأساسية
*   حساب على [Cloudflare](https://dash.cloudflare.com/).
*   مفتاح API ليوتيوب (YouTube API Key).
*   معرف القناة (YouTube Channel ID).

---

## 2. أوامر التجهيز (بواسطة الـ Terminal)

قم بتشغيل الأوامر التالية بالترتيب في مجلد المشروع:

1. **تسجيل الدخول:**
   ```bash
   npx wrangler login
   ```
2. **إنشاء قاعدة البيانات (D1):**
   ```bash
   npx wrangler d1 create english-portfolio
   ```
   *سيظهر لك معرف (Database ID)، احفظه لاستخدامه لاحقاً.*

3. **تجهيز جداول البيانات (Schema):**
   ```bash
   npx wrangler d1 execute english-portfolio --file db/schema.sql
   ```

---

## 3. الرفع على Cloudflare Pages

1. اذهب إلى لوحة تحكم Cloudflare -> **Workers & Pages**.
2. اختر **Create** ثم **Pages** ثم **Connect to Git**.
3. اختر مستودع المشروع (Repository).
4. اذهب إلى **Build settings**:
   *   **Framework preset:** Next.js
   *   **Build command:** `pnpm run build` (أو `npm run build`)
   *   **Build output directory:** `.next`
5. اضغط على **Save and Deploy**.

---

## 4. إضافة البيانات المطلوبة (بيانات يوتيوب والمفاتيح)

يتم إضافة هذه البيانات في لوحة تحكم Cloudflare وليس داخل الكود مباشرة لضمان الأمان:

1. اذهب إلى مشروعك في Pages ثم اذهب إلى **Settings** -> **Environment variables**.
2. اضغط على **Add variables** وأضف القيم التالية تحت قسم **Production**:

| المفتاح (Variable Name) | الوصف |
| :--- | :--- |
| `YOUTUBE_API_KEY` | مفتاح API يوتيوب الخاص بك |
| `YOUTUBE_CHANNEL_ID` | معرف قناة اليوتيوب (Channel ID) |
| `JWT_SECRET` | كلمة سر عشوائية لتأمين لوحة الإدارة (مثلاً: `my_super_secret_key`) |
| `DB` | (مهم جداً) اذهب لقسم **Functions** وقم بربط نوع **D1 database binding** باسم `DB` واختيار قاعدة البيانات التي أنشأتها. |

---

## 5. ربط قاعدة البيانات (D1 Binding)

هذه الخطوة هي الأهم ليعمل الموقع بشكل صحيح:
1. داخل إعدادات المشروع في Pages، اذهب إلى **Settings**.
2. اختر **Functions**.
3. انزل لأسفل حتى تجد **D1 database bindings**.
4. اضغط **Add binding**.
5. اكتب في خانة الـ Variable name كلمة: `DB` (كبيرة).
6. اختر من القائمة قاعدة البيانات: `english-portfolio`.
7. اضغط **Save**.

---

## 6. أوامر التشغيل والتحقق (اختياري)
*   **للتشغيل التجريبي محلياً:** `npm run dev`
*   **لفحص الأخطاء في Cloudflare:** اذهب لقسم **Deployments** واضغط على آخر عملية رفع لمشاهدة الـ Logs.

**ملاحظة:** أي تغيير في المحتوى من لوحة الإدارة يتم حفظه فوراً في قاعدة بيانات Cloudflare D1 ويظهر في الموقع في نفس اللحظة.
