const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    trip_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    trip_title: { type: String },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    // تم التعديل هنا: حذفنا required: true لكي يقبله السيرفر حتى لو كان فارغاً
    passportNumber: { type: String }, 
    persons: { type: Number, default: 1 },
    totalPrice: { type: Number },
    paidAmount: { type: Number, default: 0 },
    remainingAmount: { type: Number },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

// حساب المبلغ المتبقي تلقائياً
BookingSchema.pre('save', function(next) {
    this.remainingAmount = this.totalPrice - (this.paidAmount || 0);
    next();
});

module.exports = mongoose.model('Booking', BookingSchema);