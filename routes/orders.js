const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/', async (req, res) => {
    const { tableNumber, items } = req.body;

    if (!tableNumber || !items || !Array.isArray(items)) {
        return res.status(400).json({ message: 'Geçersiz sipariş verisi' });
    }

    try {
        const newOrder = new Order({ tableNumber, items });
        await newOrder.save();

        console.log('✅ Yeni sipariş kaydedildi:', newOrder);
        res.status(201).json({ message: 'Sipariş alındı', order: newOrder });
    } catch (error) {
        console.error('❌ Sipariş kaydında hata:', error);
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

module.exports = router;
