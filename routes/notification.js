// routes/notification.js
const express = require('express');
const router = express.Router();
const NotificationToken = require('../models/NotificationToken');
const fetch = require('node-fetch');

// 📌 Token Kaydı (userEmail → guardianEmail eşleşmesi)
router.post('/register-token', async (req, res) => {
    const { token, userEmail, guardianEmail } = req.body;
    console.log('📥 Gelen token kaydı:', req.body);

    if (!token || !userEmail || !guardianEmail) {
        return res.status(400).json({ message: 'Token, userEmail ve guardianEmail gerekli' });
    }

    try {
        const existing = await NotificationToken.findOne({ userEmail });
        if (existing) {
            existing.token = token;
            existing.guardianEmail = guardianEmail;
            await existing.save();
            console.log('🔁 Token güncellendi:', token);
        } else {
            await NotificationToken.create({ token, userEmail, guardianEmail });
            console.log('✅ Yeni token kaydedildi:', token);
        }
        res.json({ message: 'Token kaydedildi' });
    } catch (error) {
        console.error('❌ Token kaydederken hata:', error);
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// 📌 Bildirim Gönderme (hem userEmail hem guardianEmail ile arıyor)
router.post('/send-alert', async (req, res) => {
    const { email, title, body } = req.body;
    console.log('🔔 Send-alert isteği geldi:', req.body);

    if (!email || !title || !body) {
        return res.status(400).json({ message: 'Email, başlık ve mesaj gerekli' });
    }

    try {
        // Önce userEmail olarak ara
        let entry = await NotificationToken.findOne({ userEmail: email });
        // Bulamazsa guardianEmail ile ara
        if (!entry) {
            entry = await NotificationToken.findOne({ guardianEmail: email });
        }

        if (!entry) {
            console.warn('⚠️ Token bulunamadı for:', email);
            return res.status(404).json({ message: `Token bulunamadı: ${email}` });
        }

        console.log('🔑 Bulunan token:', entry.token, ' (userEmail:', entry.userEmail, ' guardianEmail:', entry.guardianEmail, ')');

        const message = {
            to: entry.token,
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

        if (expoResponse.status !== 200) {
            console.error('❌ Expo Push API hatası:', result);
            return res.status(500).json({ message: 'Expo Push gönderme problemi', error: result });
        }

        console.log('📨 Bildirim başarılı:', result);
        res.json({ message: 'Bildirim gönderildi', result });
    } catch (error) {
        console.error('❌ Bildirim gönderilirken hata:', error);
        res.status(500).json({ message: 'Bildirim gönderme hatası', error: error.message });
    }
});

module.exports = router;
