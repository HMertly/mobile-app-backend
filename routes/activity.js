// routes/activity.js
const express = require('express');
const router = express.Router();
const Activity      = require('../models/Activity');
const DailyActivity = require('../models/DailyActivity');

// GET: cumulative veya günlük (date ile)
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
        console.error('Activity GET error:', err);
        res.status(500).json({ message: 'Sunucu hatası', error: err.message });
    }
});

// POST: cumulative veya günlük (date ile) upsert
router.post('/:email', async (req, res) => {
    try {
        const { date } = req.query;
        const { walking, running, upstairs } = req.body;
        const Model  = date ? DailyActivity : Activity;
        const filter = { email: req.params.email, ...(date && { date }) };
        const update = { walking, running, upstairs, email: req.params.email, ...(date && { date }) };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const doc = await Model.findOneAndUpdate(filter, update, options);
        res.json(doc);
    } catch (err) {
        console.error('Activity POST error:', err);
        res.status(500).json({ message: 'Sunucu hatası', error: err.message });
    }
});

module.exports = router;
