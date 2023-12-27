const express = require('express');
const Pro = require('../models/ProModel');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    const newItem = new Pro({ name, description });
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
    const { name, description } = req.body;

    const updatedProject = await Pro.findByIdAndUpdate(id, { name, description }, { new: true });

    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating experience entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Pro.findByIdAndDelete(id);
    res.json({ message: 'Projects entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting project entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
