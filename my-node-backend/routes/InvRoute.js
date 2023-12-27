const express = require('express');
const Inv = require('../models/InvModel');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const {   organization,
    role,
    duration,
    description} = req.body;
    const newItem = new Inv({ organization,
        role,
        duration,
        description });
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
    const { organization,
        role,
        duration,
        description } = req.body;

    const updatedInvolvement = await Inv.findByIdAndUpdate(id, { organization,
        role,
        duration,
        description }, { new: true });

    res.json(updatedInvolvement);
  } catch (error) {
    console.error('Error updating Involvement entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Inv.findByIdAndDelete(id);
    res.json({ message: 'Involvement entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting education entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
