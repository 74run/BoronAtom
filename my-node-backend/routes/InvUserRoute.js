const express = require('express');
const router = express.Router();

const UserProfile = require('../models/UserprofileModel');
const User = require('../models/UserModel');

router.post('/:userID/involvement', async (req, res) => {
    try {
        const { organization, role, startDate, endDate, description, includeInResume, isPresent   } = req.body;
      const userId = req.params.userID;
  
    //   if (!university || !degree || !major || !startDate || !endDate) {
    //     return res.status(400).json({ error: 'All fields are required' });
    //   }
  
      let userProfile = await UserProfile.findOne({ userID: userId });
  
      if (!userProfile) {
        userProfile = new UserProfile({ userID: userId, involvement: [] });
      }
  
      userProfile.involvement.push({
        organization: organization,
        role: role,
        startDate: startDate,
        endDate: endDate,
        description: description,
        includeInResume, 
        isPresent 
      });
  
      const savedUserProfile = await userProfile.save();
  
      res.json(savedUserProfile);
    } catch (error) {
      console.error('Error saving involvement:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  router.get('/:userId/involvement', async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const userProfile = await UserProfile.findOne({ userID: user._id });
  
      if (!userProfile) {
        return res.status(404).json({ message: 'UserProfile not found' });
      }
  
      res.json(userProfile.involvement);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  router.put('/:userId/involvement/:id', async (req, res) => {
      try {
        const user = await User.findById(req.params.userId);
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        const { id } = req.params;
        const updatedUserProfile = await UserProfile.findOneAndUpdate(
          { 'userID': user._id, 'involvement._id': id },
          {
            $set: {
              'involvement.$': req.body,
            },
          },
          { new: true }
        );
    
        res.json(updatedUserProfile);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });
    
    
  
    router.delete('/:userID/involvement/:id', async (req, res) => {
      try {
          const userId = req.params.userID;
          const user = await User.findById(userId);
  
          if (!user) {
              return res.status(404).json({ message: 'User not found' });
          }
  
          const { id } = req.params;
  
          // console.log('Deleting involvement with id:', id);
  
          const result = await UserProfile.findOneAndUpdate(
              { 'userID': user._id, 'involvement._id': id },
              { $pull: { involvement: { _id: id } } },
              { new: true }
          );
  
          // console.log("result after delete:", result)
          if (!result) {
              return res.status(404).json({ message: 'involvement not found' });
          }
  
          const updatedUserProfile = await UserProfile.findById(user._id);
          res.json(updatedUserProfile);
      } catch (error) {
          console.error('Error deleting involvement:', error.message);
          res.status(500).json({ message: 'Internal Server Error' });
      }
  });
  
    
    
    
  
  module.exports = router;
  
