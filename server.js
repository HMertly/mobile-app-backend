// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes         = require('./routes/auth');
const activityRoutes     = require('./routes/activity');
const notificationRoutes = require('./routes/notification');
const orderRoutes = require('./routes/orders');


const app = express();
app.use(express.json());
app.use(cors({ origin: '*', methods: ['GET','POST'], allowedHeaders: ['Content-Type','Authorization'] }));

app.use('/api/auth',         authRoutes);
app.use('/api/activity',     activityRoutes);
app.use('/api/notifications',notificationRoutes);
app.use('/api/orders', orderRoutes);


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB bağlantısı başarılı');
        app.listen(process.env.PORT, () =>
            console.log(`🚀 Sunucu ${process.env.PORT} portunda çalışıyor`)
        );
    })
    .catch(err => console.error('❌ MongoDB bağlantı hatası:', err));
