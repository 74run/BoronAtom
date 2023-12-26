const Item = require('../models/EduModel')

exports.createEducationItem = async (req, res) => {
    try {
      const { university, degree, graduationyear } = req.body;
      const newItem = new Item({ university, degree, graduationyear });
      await newItem.save();
      res.json(newItem);
    } catch (error) {
      console.error('Error saving item:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  exports.updateEducationItem = async (req, res) => {
    try {
      const { id } = req.params;
      const { university, degree, graduationyear } = req.body;
  
      // Find the education entry by ID and update it
      const updatedEducation = await Item.findByIdAndUpdate(id, { university, degree, graduationyear }, { new: true });
  
      res.json(updatedEducation);
    } catch (error) {
      console.error('Error updating education entry:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  
  exports.deleteEducationItem = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the education entry by ID and delete
      await Item.findByIdAndDelete(id);
  
      // Send success response
      res.json({ message: 'Education entry deleted successfully' });
    } catch (error) {
      console.error('Error deleting education entry:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  