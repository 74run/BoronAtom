const express = require('express');
const Cert = require('../models/CertModel');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const {  name,
    issuedBy,
    issuedDate,
    expirationDate,
    url } = req.body;
    const newItem = new Cert({ name,
        issuedBy,
        issuedDate,
        expirationDate,
        url });
    await newItem.save();
    res.json(newItem);
  } catch (error) {
    console.error('Error saving item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name,
        issuedBy,
        issuedDate,
        expirationDate,
        url } = req.body;

    const updatedCertificate = await Cert.findByIdAndUpdate(id, { name,
        issuedBy,
        issuedDate,
        expirationDate,
        url }, { new: true });

    res.json(updatedCertificate);
  } catch (error) {
    console.error('Error updating Certificate entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Cert.findByIdAndDelete(id);
    res.json({ message: 'Certification entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting Certification entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
