const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "المستخدم غير موجود" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "كلمة المرor خاطئة" });

        const token = jwt.sign({ id: user._id }, "SECRET_123", { expiresIn: '24h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: "خطأ في السيرفر" });
    }
});

module.exports = router;