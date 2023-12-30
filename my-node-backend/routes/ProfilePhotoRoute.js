const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const ProfilePhoto = require('../models/ProfilePhotoModel');

port = 3001;

// Define the destination folder and storage for Multer
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage });

router.use(express.json());

// // Serve static files from the 'uploads' folder
router.use('/uploads', express.static('uploads'));

// API endpoint to get the current profile photo URL
router.get('/api/profile-photo', async (req, res) => {
  try {
    const profilePhoto = await ProfilePhoto.findOne();
    if (profilePhoto) {
      res.json({ imageUrl: profilePhoto.imageUrl });
    } else {
      res.json({ imageUrl: '' });
    }
  } catch (error) {
    console.error('Error fetching profile photo:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint to upload a new photo
router.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;

    // Save the new photo URL to the database
    const newProfilePhoto = new ProfilePhoto({ imageUrl });
    await newProfilePhoto.save();

    res.json({ success: true, imageUrl: newProfilePhoto.imageUrl });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;