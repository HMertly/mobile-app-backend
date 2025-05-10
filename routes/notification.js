// routes/notification.js
const express = require('express');
const router = express.Router();
const NotificationToken = require('../models/NotificationToken');
const fetch = require('node-fetch');

// Token kaydetme
router.post('/register-token', async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ message: 'Token gerekli' });
    }

    try {
        const existing = await NotificationToken.findOne({ token });
        if (!existing) {
            await NotificationToken.create({ token });
            console.log('🔐 Yeni token kaydedildi:', token);
        } else {
            console.log('ℹ️ Token zaten mevcut:', token);
        }
        res.json({ message: 'Token kaydedildi' });
    } catch (error) {
        console.error('❌ Token kaydederken hata:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// Bildirim gönderme
router.post('/send-alert', async (req, res) => {
    const { title, body } = req.body;

    if (!title || !body) {
        return res.status(400).json({ message: 'Başlık ve mesaj gerekli' });
    }

    try {
        const tokens = await NotificationToken.find();

        const messages = tokens.map(({ token }) => ({
            to: token,
            sound: 'default',
            title,
            body,
        }));

        const expoResponse = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messages),
        });

        const result = await expoResponse.json();
        console.log('📨 Bildirim gönderildi:', result);
        res.json({ message: 'Bildirim gönderildi', result });
    } catch (error) {
        console.error('❌ Bildirim gönderilirken hata:', error);
        res.status(500).json({ message: 'Bildirim gönderme hatası' });
    }
});

module.exports = router;
