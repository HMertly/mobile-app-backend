const express = require('express');
const router = express.Router();
const NotificationToken = require('../models/NotificationToken');

// Token kaydetme
router.post('/register-token', async (req, res) => {
    const { token, email } = req.body;

    console.log("📥 Token kaydı için gelen istek:", { token, email });

    if (!token || !email) {
        console.warn("⚠️ Eksik veri:", { token, email });
        return res.status(400).json({ message: 'Token ve email gerekli' });
    }

    try {
        const existing = await NotificationToken.findOne({ token });

        if (!existing) {
            await NotificationToken.create({ token, email }); // ✅ email ile birlikte kaydet
            console.log("✅ Yeni token eklendi:", token);
        } else {
            console.log("ℹ️ Token zaten kayıtlı:", token);
        }

        res.json({ message: 'Token kaydedildi' });
    } catch (error) {
        console.error('❌ Token kaydederken hata:', error);
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Bildirim gönderme
router.post('/send-alert', async (req, res) => {
    const { title, body, email } = req.body;

    if (!title || !body || !email) {
        return res.status(400).json({ message: 'Başlık, mesaj ve email gerekli' });
    }

    try {
        const tokens = await NotificationToken.find({ email });

        if (!tokens.length) {
            return res.status(404).json({ message: `Bu email'e ait token bulunamadı: ${email}` });
        }

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
        console.error('❌ Bildirim gönderilirken hata:', error.message || error);
        res.status(500).json({ message: 'Bildirim gönderme hatası', error: error.message });
    }
});

module.exports = router;
