// البحث عن دالة createBooking واستبدالها بهذا لضمان عمل الإضافة اليدوية
exports.createBooking = async (req, res) => {
    try {
        const { name, phone, tripId, passportNumber, paidAmount } = req.body;

        // 1. جلب بيانات الرحلة لتعرف الثمن واسم الرحلة
        const trip = await Trip.findById(tripId);
        if (!trip) return res.status(404).json({ message: "الرحلة غير موجودة" });

        // 2. حساب المبلغ المتبقي تلقائياً
        const remainingAmount = trip.price - (paidAmount || 0);

        // 3. إنشاء سجل المسافر الجديد
        const newBooking = new Booking({
            name,
            phone,
            tripId,
            trip_title: trip.title, // نأخذ الاسم من الرحلة مباشرة
            passportNumber,
            paidAmount: paidAmount || 0,
            remainingAmount: remainingAmount,
            status: 'Pending' // أو 'Confirmed' حسب رغبتك
        });

        await newBooking.save();

        // 4. (اختياري) خصم مقعد من الرحلة إذا أردت
        // trip.availableSeats -= 1;
        // await trip.save();

        res.status(201).json(newBooking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};