const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Trip = require('../models/trip');

// 1. جلب كل الحجوزات (للمدير)
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. إضافة حجز جديد (من زبون أو يدوي)
router.post('/', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        const savedBooking = await newBooking.save();

        // إذا كانت الحالة مؤكدة فوراً (إضافة يدوية)، نخصم المقاعد
        if (req.body.status === 'Confirmed') {
            await Trip.findByIdAndUpdate(req.body.trip_id, { 
                $inc: { availableSeats: -req.body.persons } 
            });
        }

        res.status(201).json(savedBooking);
    } catch (err) {
        res.status(400).json({ message: "فشل إضافة الحجز: " + err.message });
    }
});

// 3. التحديث الشامل (تعديل الحالة، جواز السفر، أو المبلغ المدفوع)
router.patch('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: "الحجز غير موجود" });

        const oldStatus = booking.status;
        const newStatus = req.body.status || oldStatus;

        // --- أولاً: منطق تحديث المقاعد المتوفرة ---
        // إذا تغيرت الحالة إلى "مؤكد" ولم تكن كذلك: نخصم مقاعد
        if (newStatus === 'Confirmed' && oldStatus !== 'Confirmed') {
            await Trip.findByIdAndUpdate(booking.trip_id, { 
                $inc: { availableSeats: -booking.persons } 
            });
        } 
        // إذا تم إلغاء حجز كان مؤكداً: نعيد المقاعد للرحلة
        else if ((newStatus === 'Cancelled' || newStatus === 'Pending') && oldStatus === 'Confirmed') {
            await Trip.findByIdAndUpdate(booking.trip_id, { 
                $inc: { availableSeats: booking.persons } 
            });
        }

        // --- ثانياً: تحديث البيانات المرسلة من المدير ---
        if (req.body.status) booking.status = newStatus;
        if (req.body.passportNumber !== undefined) booking.passportNumber = req.body.passportNumber;
        
        // تحديث المبلغ المدفوع وضمان أنه رقم
        if (req.body.paidAmount !== undefined) {
            booking.paidAmount = Number(req.body.paidAmount);
        }

        // حفظ التغييرات (سيقوم الموديل تلقائياً بإعادة حساب المتبقي)
        const updatedBooking = await booking.save();
        res.json(updatedBooking);

    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "فشل التحديث: " + err.message });
    }
});

// 4. حذف حجز نهائياً
router.delete('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: "الحجز غير موجود" });

        // إذا حذفنا حجزاً مؤكداً، يجب إعادة المقاعد للرحلة
        if (booking.status === 'Confirmed') {
            await Trip.findByIdAndUpdate(booking.trip_id, { 
                $inc: { availableSeats: booking.persons } 
            });
        }

        await Booking.findByIdAndDelete(req.params.id);
        res.json({ message: "تم حذف الحجز وإعادة المقاعد بنجاح" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;