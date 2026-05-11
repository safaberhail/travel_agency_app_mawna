const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Trip = require('../models/trip');

// 1. جلب كل الحجوزات (للمدير) - مرتبة من الأحدث إلى الأقدم
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. إضافة حجز جديد (من زبون أو يدوياً من المدير)
router.post('/', async (req, res) => {
    try {
        // دعم كلاً من tripId (من الإضافة اليدوية) أو trip_id (من الموقع)
        const targetTripId = req.body.tripId || req.body.trip_id;

        // البحث عن الرحلة لجلب بياناتها (الاسم والسعر)
        const trip = await Trip.findById(targetTripId);
        if (!trip) return res.status(404).json({ message: "الرحلة المطلوبة غير موجودة" });

        // تجهيز بيانات الحجز ودمج اسم الرحلة تلقائياً
        const bookingData = {
            ...req.body,
            trip_id: targetTripId,
            trip_title: trip.title, // جلب اسم الرحلة من السيرفر لضمان ظهوره في الجدول
            persons: req.body.persons || 1, // الافتراضي شخص واحد إذا لم يحدد
            paidAmount: Number(req.body.paidAmount) || 0
        };

        const newBooking = new Booking(bookingData);
        const savedBooking = await newBooking.save();

        // إذا أضاف المدير المسافر كـ "مؤكد" (Confirmed) فوراً، نخصم المقاعد
        if (req.body.status === 'Confirmed') {
            await Trip.findByIdAndUpdate(targetTripId, { 
                $inc: { availableSeats: -(req.body.persons || 1) } 
            });
        }

        res.status(201).json(savedBooking);
    } catch (err) {
        console.error("Error creating booking:", err);
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

        // --- أولاً: منطق تحديث المقاعد المتوفرة في الرحلة ---
        if (newStatus === 'Confirmed' && oldStatus !== 'Confirmed') {
            // تحويل من انتظار إلى مؤكد -> خصم مقاعد
            await Trip.findByIdAndUpdate(booking.trip_id, { 
                $inc: { availableSeats: -booking.persons } 
            });
        } 
        else if ((newStatus === 'Cancelled' || newStatus === 'Pending') && oldStatus === 'Confirmed') {
            // تحويل من مؤكد إلى (ملغي أو انتظار) -> استعادة مقاعد
            await Trip.findByIdAndUpdate(booking.trip_id, { 
                $inc: { availableSeats: booking.persons } 
            });
        }

        // --- ثانياً: تحديث البيانات في قاعدة البيانات ---
        if (req.body.status) booking.status = newStatus;
        if (req.body.passportNumber !== undefined) booking.passportNumber = req.body.passportNumber;
        
        if (req.body.paidAmount !== undefined) {
            booking.paidAmount = Number(req.body.paidAmount);
        }

        // الحفظ سيقوم الموديل تلقائياً بإعادة حساب المبلغ المتبقي (Remaining)
        const updatedBooking = await booking.save();
        res.json(updatedBooking);

    } catch (err) {
        console.error("Error updating booking:", err);
        res.status(400).json({ message: "فشل التحديث: " + err.message });
    }
});

// 4. حذف حجز نهائياً من السجل
router.delete('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: "الحجز غير موجود" });

        // إذا حذفنا حجزاً كان "مؤكداً"، يجب إعادة المقاعد للرحلة فوراً
        if (booking.status === 'Confirmed') {
            await Trip.findByIdAndUpdate(booking.trip_id, { 
                $inc: { availableSeats: booking.persons } 
            });
        }

        await Booking.findByIdAndDelete(req.params.id);
        res.json({ message: "تم حذف الحجز وإعادة المقاعد للرحلة بنجاح" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;