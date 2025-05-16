// ✅ models/NotificationToken.js
const mongoose = require('mongoose');

const notificationTokenSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    email: { type: String, required: true }, // ✅ email alanı eklendi
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NotificationToken', notificationTokenSchema);


// ✅ routes/notification.js
const express = require('express');
const router = express.Router();
const NotificationToken = require('../models/NotificationToken');
const axios = require('axios');

// 📌 Token kaydetme
router.post('/register-token', async (req, res) => {
    const { token, email } = req.body;
    if (!token || !email) {
        return res.status(400).json({ message: 'Token ve email gerekli' });
    }

    try {
        const existing = await NotificationToken.findOne({ email });
        if (existing) {
            existing.token = token;
            await existing.save();
            console.log('🔁 Token güncellendi:', token);
        } else {
            await NotificationToken.create({ token, email });
            console.log('✅ Yeni token kaydedildi:', token);
        }

        res.json({ message: 'Token kaydedildi' });
    } catch (error) {
        console.error('❌ Token kaydederken hata:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// 📌 Bildirim gönderme
router.post('/send-alert', async (req, res) => {
    const { email, title, body } = req.body;

    if (!title || !body || !email) {
        return res.status(400).json({ message: 'Email, başlık ve mesaj gerekli' });
    }

    try {
        const target = await NotificationToken.findOne({ email });
        if (!target) {
            return res.status(404).json({ message: 'Email için token bulunamadı' });
        }

        const message = {
            to: target.token,
            sound: 'default',
            title,
            body,
        };

        const expoResponse = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        const result = await expoResponse.json();
        console.log('📨 Bildirim gönderildi:', result);
        res.json({ message: 'Bildirim gönderildi', result });
    } catch (error) {
        console.error('❌ Bildirim gönderilirken hata:', error.message || error);
        res.status(500).json({ message: 'Bildirim gönderme hatası', error: error.message });
    }
});

module.exports = router;