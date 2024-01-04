const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserprofileModel');
const User = require('../models/UserModel')


router.post('/:userID/education', async (req, res) => {
    try {
      const { university, degree, major, startDate, endDate } = req.body;
      const userId = req.params.userID;
      console.log("UserID:", userId);
      // Find the user profile by userId
    //   const userProfile = await User.findOne({_id :userId});
    //   console.log('UserProfile ID:', userProfile.username)
  
      let userProfile = await UserProfile.findOne({ userID: userId });

      if (!userProfile) {
        // If the user profile doesn't exist, create a new one
        userProfile = new UserProfile({ userID: userId, education: [] });
      }
  
      // Add education to the user's profile
      userProfile.education.push({
        university: university,
        degree: degree,
        major: major,
        startDate: startDate,
        endDate: endDate,
      });
  
      // Save the updated user profile
      const savedUserProfile = await userProfile.save();
  
      res.json(savedUserProfile);
    } catch (error) {
      console.error('Error saving education:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  router.get('/:userId/education', async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const userProfile = await UserProfile.findOne({ userID: user._id });
      if (!userProfile) {
        return res.status(404).json({ message: 'UserProfile not found' });
      }
  
      res.json(userProfile.education);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.put('/:userId/education/:educationId', async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      let userProfile = await UserProfile.findOne({ userID: user._id });
      if (!userProfile) {
        return res.status(404).json({ message: 'UserProfile not found' });
      }
  
      const { educationId } = req.params;
      const existingEducationIndex = userProfile.education.findIndex(edu => edu._id == educationId);
  
      if (existingEducationIndex === -1) {
        return res.status(404).json({ message: 'Education not found' });
      }
  
      userProfile.education[existingEducationIndex] = { ...userProfile.education[existingEducationIndex], ...req.body };
  
      const savedUserProfile = await userProfile.save();
  
      res.json(savedUserProfile);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Delete education for a specific user
  router.delete('/:userId/education/:educationId', async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      let userProfile = await UserProfile.findOne({ userID: user._id });
      if (!userProfile) {
        return res.status(404).json({ message: 'UserProfile not found' });
      }
  
      const { educationId } = req.params;
      const existingEducationIndex = userProfile.education.findIndex(edu => edu._id == educationId);
  
      if (existingEducationIndex === -1) {
        return res.status(404).json({ message: 'Education not found' });
      }
  
      userProfile.education.splice(existingEducationIndex, 1);
  
      const savedUserProfile = await userProfile.save();
  
      res.json(savedUserProfile);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
module.exports = router;
