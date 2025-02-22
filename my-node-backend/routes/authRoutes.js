const express = require('express');
const router = express.Router();
const { oauth2Client } = require('../config/google.config');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

// Generate Google OAuth URL
router.get('/auth/google/url', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    prompt: 'consent'
  });
  res.json({ url });
});

// Handle Google OAuth callback
router.get('/auth/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    
    // Get tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });
    const userData = await response.json();

    // Find or create user
    let user = await User.findOne({ email: userData.email });
    if (!user) {
      user = await User.create({
        email: userData.email,
        firstName: userData.given_name,
        lastName: userData.family_name,
        profilePicture: userData.picture,
        googleId: userData.sub,
        isEmailVerified: true
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&userId=${user._id}`);
  } catch (error) {
    console.error('Google auth error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=authentication_failed`);
  }
});

module.exports = router; 