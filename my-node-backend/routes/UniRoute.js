const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get('/api/universities', (req, res) => {
  fs.readFile('./vercel/path0/my-node-backend/UniName.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const jsonData = JSON.parse(data);
    const universityNames = jsonData.map(entry => entry.name);

    res.json({ universities: universityNames });
  });
});

module.exports = router;
