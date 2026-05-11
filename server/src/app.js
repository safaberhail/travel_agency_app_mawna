const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express(); // هذا هو السطر الذي كان ناقصاً وتسبب في الخطأ
app.use(cors());
app.use(express.json());

// إعداد مجلد الصور
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static(uploadDir));

// رابط القاعدة والبورت (جاهز للنشر وللجهاز المحلي)
const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/travel_agency';
const PORT = process.env.PORT || 5001;

const User = require('./models/user');

mongoose.connect(dbURI)
    .then(async () => {
        console.log("✅ Database Connected");
        // سكريبت إنشاء حساب المدير تلقائياً
        await User.deleteMany({ username: 'agence_admin' });
        const hashedPassword = await bcrypt.hash('password123', 10);
        await new User({ username: 'agence_admin', password: hashedPassword }).save();
        console.log("🚀 حساب المدير جاهز: agence_admin / password123");
    })
    .catch(err => console.log("❌ DB Error:", err));

// المسارات
app.use('/api/trips', require('./routes/tripRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));