const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

// GET: Belirli email'e ait veriyi getir
router.get('/:email', async (req, res) => {
    try {
        const activity = await Activity.findOne({ email: req.params.email });
        if (!activity) return res.status(404).json({ message: "Veri bulunamadı" });
        res.json(activity);
    } catch (err) {
        res.status(500).json({ message: "Sunucu hatası" });
    }
});

// POST: Belirli email'e ait veriyi güncelle veya oluştur
router.post('/:email', async (req, res) => {
    try {
        const existing = await Activity.findOne({ email: req.params.email });

        if (existing) {
            existing.walking = req.body.walking;
            existing.running = req.body.running;
            existing.upstairs = req.body.upstairs;
            await existing.save();
            return res.json({ message: "Güncellendi" });
        } else {
            const newActivity = new Activity({
                email: req.params.email,
                walking: req.body.walking,
                running: req.body.running,
                upstairs: req.body.upstairs
            });
            await newActivity.save();
            return res.status(201).json({ message: "Oluşturuldu" });
        }
    } catch (err) {
        res.status(500).json({ message: "Sunucu hatası" });
    }
});

module.exports = router;
