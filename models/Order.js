// models/Order.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    tableNumber: {
        type: String,
        required: true
    },
    items: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
