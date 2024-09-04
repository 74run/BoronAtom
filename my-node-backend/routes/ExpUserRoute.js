const express = require('express');
const router = express.Router();

const UserProfile = require('../models/UserprofileModel');
const User = require('../models/UserModel');

router.post('/:userID/experience', async (req, res) => {
  try {
      const { jobTitle, company, location, startDate, endDate, description, includeInResume, isPresent } = req.body;
      const userId = req.params.userID;

      let userProfile = await UserProfile.findOne({ userID: userId });

      if (!userProfile) {
          userProfile = new UserProfile({ userID: userId, experience: [] });
      }

      userProfile.experience.push({
          jobTitle: jobTitle,
          company: company,
          location: location,
          startDate: startDate,
          endDate: endDate,
          description: description,
          includeInResume,
          isPresent
      });

      const savedUserProfile = await userProfile.save();

      res.json(savedUserProfile);
  } catch (error) {
      console.error('Error saving experience:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

  
  router.get('/:userId/experience', async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const userProfile = await UserProfile.findOne({ userID: user._id });
  
      if (!userProfile) {
        return res.status(404).json({ message: 'UserProfile not found' });
      }
  
      res.json(userProfile.experience);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  router.put('/:userId/experience/:id', async (req, res) => {
      try {
        const user = await User.findById(req.params.userId);
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        const { id } = req.params;
        const updatedUserProfile = await UserProfile.findOneAndUpdate(
          { 'userID': user._id, 'experience._id': id },
          {
            $set: {
              'experience.$': req.body,
            },
          },
          { new: true }
        );
    
        res.json(updatedUserProfile);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });
    
    
  
    router.delete('/:userID/experience/:id', async (req, res) => {
      try {
          const userId = req.params.userID;
          const user = await User.findById(userId);
  
          if (!user) {
              return res.status(404).json({ message: 'User not found' });
          }
  
          const { id } = req.params;
  
          // console.log('Deleting experience with id:', id);
  
          const result = await UserProfile.findOneAndUpdate(
              { 'userID': user._id, 'experience._id': id },
              { $pull: { experience: { _id: id } } },
              { new: true }
          );
  
          // console.log("result after delete:", result)
          if (!result) {
              return res.status(404).json({ message: 'Experience not found' });
          }
  
          const updatedUserProfile = await UserProfile.findById(user._id);
          res.json(updatedUserProfile);
      } catch (error) {
          console.error('Error deleting experience:', error.message);
          res.status(500).json({ message: 'Internal Server Error' });
      }
  });
  
    
    
    
  
  module.exports = router;
  
