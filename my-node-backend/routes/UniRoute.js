const express = require('express');
const universities = require('./UniNameURL_New.json');

const router = express.Router();

router.get('/api/universities', (req, res) => {
  try {
    // Validate that universities is an array
    if (!Array.isArray(universities)) {
      throw new Error('Invalid data format');
    }

    // Map the data into a more useful structure
    const universityData = universities.map(entry => ({
      name: entry.name,
      url:  entry.web_pages // Handle cases where web_pages might be empty
    }));

    res.json({ universities: universityData });
  } catch (error) {
    console.error('Error processing university data:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

module.exports = router;