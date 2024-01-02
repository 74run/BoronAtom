const express = require('express');
const Exp = require('../models/ExpModel');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { jobTitle, company, location, startDate, endDate, description } = req.body;
    const newItem = new Exp({ jobTitle, company, location, startDate, endDate, description });
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
    const { jobTitle, company, location, startDate, endDate, description } = req.body;

    const updatedExperience = await Exp.findByIdAndUpdate(id, { jobTitle, company, location, startDate, endDate, description }, { new: true });

    res.json(updatedExperience);
  } catch (error) {
    console.error('Error updating experience entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Exp.findByIdAndDelete(id);
    res.json({ message: 'Experience entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
