const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs'); // للتشفير
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// إعداد المجلدات والصور
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static(uploadDir));

// الاتصال بالقاعدة وإنشاء حساب المدير تلقائياً
const dbURI = 'mongodb://127.0.0.1:27017/travel_agency';
const User = require('./src/models/user');

mongoose.connect(dbURI)
    .then(async () => {
        console.log("✅ Database Connected");
        
        // --- سكريبت الضبط المصنعي لحساب المدير ---
        await User.deleteMany({ username: 'agence_admin' });
        const hashedPassword = await bcrypt.hash('password123', 10);
        await new User({ username: 'agence_admin', password: hashedPassword }).save();
        console.log("🚀 تم تحديث بيانات الدخول: agence_admin / password123");
        // ---------------------------------------
    })
    .catch(err => console.log(err));

// المسارات
app.use('/api/trips', require('./src/routes/tripRoutes'));
app.use('/api/bookings', require('./src/routes/bookingRoutes'));
app.use('/api/auth', require('./src/routes/authRoutes'));

const PORT = 5001;
app.listen(PORT, () => console.log(`🚀 Server on https://travel-agency-app-mawna-3.onrender.com/${PORT}`));