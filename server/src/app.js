// 1. تغيير سطر الاتصال بقاعدة البيانات ليكون مرناً
const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/travel_agency';

// 2. تغيير سطر البورت ليكون مرناً (هذا هو الأهم لموقع ريندر)
const PORT = process.env.PORT || 5001;

// 3. تأكدي أن سطر التشغيل مكتوب هكذا
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));