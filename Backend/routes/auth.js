const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/student');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const student = await Student.create({ name, email, password: hash });
    res.status(201).json({ msg: 'Student registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await Student.findOne({ email });
    if (!student) return res.status(400).json({ msg: 'Student not found' });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, student: { id: student._id, name: student.name, email: student.email } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
