const express = require('express');
const Edu = require('../models/EduModel');

const router = express.Router();



router.post('/', async (req, res) => {
  try {
    const { userID, university, degree, major, startDate, endDate } = req.body;
    const newItem = new Edu({ userID, university, degree, major, startDate, endDate });
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
    const { university, degree, major, startDate, endDate } = req.body;

    const updatedEducation = await Edu.findByIdAndUpdate(
      id,
      { university, degree, major, startDate, endDate },
      { new: true }
    );

    res.json(updatedEducation);
  } catch (error) {
    console.error('Error updating education entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Edu.findByIdAndDelete(id);
    res.json({ message: 'Education entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting education entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
