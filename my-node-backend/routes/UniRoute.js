const express = require('express');
const fs = require('fs');

const router = express.Router();

const universityNames = [];

fs.readFile('./my-node-backend/UniName.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }

  const jsonData = JSON.parse(data);
  universityNames.push(...jsonData.map(entry => entry.name));
//   console.log('University names:', universityNames);
});

router.get('/api/universities', (req, res) => {
  res.json({ universities: universityNames });
});

module.exports = router;
