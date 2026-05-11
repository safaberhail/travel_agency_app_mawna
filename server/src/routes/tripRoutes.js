const express = require('express');
const router = express.Router();
const Trip = require('../models/trip');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// إعداد مجلد الرفع
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage: storage });

// 1. جلب كل الرحلات
router.get('/', async (req, res) => {
    try {
        const trips = await Trip.find().sort({ createdAt: -1 });
        res.json(trips);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// 2. جلب رحلة واحدة (حل مشكلة "جاري التحميل")
router.get('/:id', async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: "الرحلة غير موجودة" });
        res.json(trip);
    } catch (err) { res.status(500).json({ message: "المعرف غير صحيح" }); }
});

// 3. إضافة رحلة
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, country, category, duration, price, maxSeats, date, description } = req.body;
        const newTrip = new Trip({
            title, country, category, duration, 
            price: Number(price), maxSeats: Number(maxSeats), availableSeats: Number(maxSeats),
            date, description, image: `/uploads/${req.file.filename}`
        });
        await newTrip.save();
        res.status(201).json({ message: "تمت الإضافة" });
    } catch (err) { res.status(400).json({ message: err.message }); }
});

// 4. حذف رحلة
router.delete('/:id', async (req, res) => {
    try {
        const trip = await Trip.findByIdAndDelete(req.params.id);
        if (trip && trip.image) {
            const fullPath = path.join(__dirname, '../../', trip.image);
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        }
        res.json({ message: "تم حذف الرحلة" });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;