const mongoose = require('mongoose');
const TripSchema = new mongoose.Schema({
    title: { type: String, required: true },
    country: { type: String, required: true },
    category: { type: String, enum: ['سياحة خارجية', 'سياحة داخلية', 'عمرة'], default: 'سياحة خارجية' },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    maxSeats: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    date: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }
});
module.exports = mongoose.model('Trip', TripSchema);