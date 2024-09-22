const express = require('express');
const universities = require('./UniName.json');

const router = express.Router();

router.get('/api/universities', (req, res) => {
  try {
    const universityNames = universities.map(entry => entry.name);
    // const universityUrl = universities.map(entry => entry.domains[0]);
    res.json({ universities: universityNames, });
  } catch (error) {
    console.error('Error reading JSON file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
