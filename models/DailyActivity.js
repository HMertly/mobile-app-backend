// models/DailyActivity.js
const mongoose = require('mongoose');

const dailySchema = new mongoose.Schema({
    email:    { type: String, required: true },
    date:     { type: String, required: true }, // "YYYY-MM-DD"
    walking:  { type: Number, default: 0 },
    running:  { type: Number, default: 0 },
    upstairs: { type: Number, default: 0 }
});

dailySchema.index({ email: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyActivity', dailySchema);


// routes/activity.js
const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const DailyActivity = require('../models/DailyActivity');

// GET: cumulative or daily by ?date=
router.get('/:email', async (req, res) => {
    try {
        const { date } = req.query;
        if (date) {
            const daily = await DailyActivity.findOne({ email: req.params.email, date });
            return res.json(daily || { walking: 0, running: 0, upstairs: 0 });
        }
        const activity = await Activity.findOne({ email: req.params.email });
        return res.json(activity || { walking: 0, running: 0, upstairs: 0 });
    } catch (err) {
        res.status(500).json({ message: 'Sunucu hatası', error: err.message });
    }
});

// POST: update cumulative or daily by ?date=
router.post('/:email', async (req, res) => {
    try {
        const { date } = req.query;
        const { walking, running, upstairs } = req.body;
        const Model = date ? DailyActivity : Activity;
        const filter = { email: req.params.email, ...(date && { date }) };
        const update = { walking, running, upstairs, email: req.params.email, ...(date && { date }) };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const doc = await Model.findOneAndUpdate(filter, update, options);
        res.json(doc);
    } catch (err) {
        res.status(500).json({ message: 'Sunucu hatası', error: err.message });
    }
});

module.exports = router;

// -------------------
// server.js: Ensure route mounting updated
// In server.js replace the two lines mounting activityRoutes with:
//  app.use('/api/activity', require('./routes/activity'));
// And remove any duplicate mounting to avoid conflicts.

// Example server.js snippet:
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();
// const authRoutes = require('./routes/auth');
// const activityRoutes = require('./routes/activity');
// const notificationRoutes = require('./routes/notification');
//
// const app = express();
// app.use(express.json());
// app.use(cors({ origin: '*', methods: ['GET','POST'], allowedHeaders: ['Content-Type','Authorization'] }));
//
// // Auth & Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/activity', activityRoutes);
// app.use('/api/notifications', notificationRoutes);
//
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => app.listen(process.env.PORT, () => console.log(`🚀 Sunucu ${process.env.PORT} portunda`)))
//   .catch(err => console.error(err));
