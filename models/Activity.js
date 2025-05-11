const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    walking: { type: Number, default: 0 },
    running: { type: Number, default: 0 },
    upstairs: { type: Number, default: 0 }
});

module.exports = mongoose.model('Activity', activitySchema);
