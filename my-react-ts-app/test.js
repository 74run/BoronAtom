// backend/routes/educations.js

const express = require('express');
const router = express.Router();
const Education = require('../models/Education');

// Get all educations
router.get('/educations', async (req, res) => {
  try {
    const educations = await Education.find();
    res.json({ educations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new education entry
router.post('/educations', async (req, res) => {
  const { university, degree, graduationYear } = req.body;
  
  try {
    const newEducation = new Education({ university, degree, graduationYear });
    await newEducation.save();
    res.json({ message: 'Education entry created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
