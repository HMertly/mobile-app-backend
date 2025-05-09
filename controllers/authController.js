const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    console.log("🔔 /register endpoint tetiklendi");

    console.log("📥 Gelen istek verisi (req.body):", req.body);

    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email zaten kayıtlı' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Kayıt başarılı' });
    } catch (error) {
        console.error('Kayıt hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Kullanıcı bulunamadı' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Şifre yanlış' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ token });
    } catch (error) {
        console.error('Giriş hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};
