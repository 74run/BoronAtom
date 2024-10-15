const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const UserProfile = require('../models/UserprofileModel');
const User = require('../models/UserModel');


  router.post('/:userID/skill', async (req, res) => {
    try {
        const { domain, name, includeInResume } = req.body;
      const userId = req.params.userID;
  
    //   if (!university || !degree || !major || !startDate || !endDate) {
    //     return res.status(400).json({ error: 'All fields are required' });
    //   }
  
      let userProfile = await UserProfile.findOne({ userID: userId });
  
      if (!userProfile) {
        userProfile = new UserProfile({ userID: userId, skills: [] });
      }
  
      userProfile.skills.push({
        domain: domain,
        name: name, 
        includeInResume
      });
  
      const savedUserProfile = await userProfile.save();
  
      res.json(savedUserProfile);
    } catch (error) {
      console.error('Error saving project:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  router.delete('/:userID/skill/:id', async (req, res) => {
    try {
        const userId = req.params.userID;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { id } = req.params;

        // console.log('Deleting skill with id:', id);

        const result = await UserProfile.findOneAndUpdate(
            { 'userID': user._id, 'skills._id': id },
            { $pull: { skills: { _id: id } } },
            { new: true }
        );

        // console.log("result after delete:", result)
        if (!result) {
            return res.status(404).json({ message: 'project not found' });
        }

        const updatedUserProfile = await UserProfile.findById(user._id);
        res.json(updatedUserProfile);
    } catch (error) {
        console.error('Error deleting project:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/:userID/skill', async (req, res) => {
    try {
      const userId = req.params.userID;
      const userProfile = await UserProfile.findOne({ userID: userId });
  
      if (!userProfile) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // const userProfile = await UserProfile.findOne({ userID: user._id });
  
      if (!userProfile) {
        return res.status(404).json({ message: 'UserProfile not found' });
      }
  
      res.json(userProfile.skills);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.put('/:userID/skill/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.userID);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const { id } = req.params;
      const updatedUserProfile = await UserProfile.findOneAndUpdate(
        { 'userID': user._id, 'skills._id': id },
        {
          $set: {
            'skills.$': req.body,
          },
        },
        { new: true }
      );
  
      res.json(updatedUserProfile);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.put('/:userId/skills/reorder', async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const { skills } = req.body; // Reordered list of skills from the frontend
  
      // Update the user's profile with the reordered skills
      const updatedUserProfile = await UserProfile.findOneAndUpdate(
        { userID: user._id },
        { $set: { skills: skills } }, // Replace old skills array with the reordered one
        { new: true } // Return the updated document
      );
  
      if (!updatedUserProfile) {
        return res.status(404).json({ message: 'User profile not found' });
      }
  
      res.json(updatedUserProfile); // Return the updated profile
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


  module.exports = router;