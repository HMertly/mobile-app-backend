const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();

// ✅ Middleware – sıraya dikkat!
app.use(express.json()); // Gelen JSON verisini parse eder
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Routes
app.use('/api/auth', authRoutes);

// ✅ MongoDB Bağlantısı
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB bağlantısı başarılı');
        app.listen(process.env.PORT, () =>
            console.log(`🚀 Sunucu ${process.env.PORT} portunda çalışıyor`)
        );
    })
    .catch((err) => console.error('❌ MongoDB bağlantı hatası:', err));
