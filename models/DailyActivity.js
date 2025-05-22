// models/DailyActivity.js
const mongoose = require('mongoose');

const dailySchema = new mongoose.Schema({
    email:    { type: String, required: true },
    date:     { type: String, required: true }, // “YYYY-MM-DD” formatında
    walking:  { type: Number, default: 0 },
    running:  { type: Number, default: 0 },
    upstairs: { type: Number, default: 0 },
});

// Aynı email ve date için tek kayıt olacak şekilde index
dailySchema.index({ email: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyActivity', dailySchema);
