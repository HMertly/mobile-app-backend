const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// ✅ Route dosyaları
const authRoutes = require('./routes/auth');
const notificationRoutes = require('./routes/notification'); // <- ekledik

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes); // <- burada tanıttık

// ✅ MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB bağlantısı başarılı');
        app.listen(process.env.PORT, () =>
            console.log(`🚀 Sunucu ${process.env.PORT} portunda çalışıyor`)
        );
    })
    .catch((err) => console.error('❌ MongoDB bağlantı hatası:', err));
