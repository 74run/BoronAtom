const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/UserModel');

const router = express.Router();




router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.status(400).json({ success: false, message: 'User already exists.' });
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
    
        res.status(200).json({ success: true, message: 'User registered successfully.' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
    
        if (!user) {
          return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
    
        const isPasswordValid = bcrypt.compare(password, user.password);
    
        if (!isPasswordValid) {
          return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
    
        res.status(200).json({ success: true, message: 'User logged in successfully.' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });

router.get('/user', async (req, res) => {
    try {
        const userId = req.userId;
        const userLog = await User.find({ userId });
        res.status(200).json(userLog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
    });


module.exports = (app) => {
  app.use('/api', router);
};
