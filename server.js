    const express = require('express');
    const mongoose = require('mongoose');
    const activityRoutes = require('./routes/activity');
    const cors = require('cors');
    require('dotenv').config();

    // ✅ Route dosyaları
    const authRoutes = require('./routes/auth');
    const notificationRoutes = require('./routes/notification'); // <- bildirim route'u

    const app = express();

    // ✅ Middleware
    app.use(express.json());
    app.use(cors({
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));
    app.use('/api/activity', activityRoutes);

    // ✅ Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/notifications', notificationRoutes); // <- bildirim rotasını tanıt
    app.use('/api/activity', activityRoutes);

    // ✅ MongoDB bağlantısı
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('✅ MongoDB bağlantısı başarılı');
            app.listen(process.env.PORT, () =>
                console.log(`🚀 Sunucu ${process.env.PORT} portunda çalışıyor`)
            );
        })
        .catch((err) => console.error('❌ MongoDB bağlantı hatası:', err));
