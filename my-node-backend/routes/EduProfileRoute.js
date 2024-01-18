const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');


const UserProfile = require('../models/UserprofileModel');
const User = require('../models/UserModel');






router.post('/:userID/education', async (req, res) => {
  try {
    const { university, degree, major, startDate, endDate } = req.body;
    const userId = req.params.userID;

    if (!university || !degree || !major || !startDate || !endDate) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    let userProfile = await UserProfile.findOne({ userID: userId });

    if (!userProfile) {
      userProfile = new UserProfile({ userID: userId, education: [] });
    }

    userProfile.education.push({
      university: university,
      degree: degree,
      major: major,
      startDate: startDate,
      endDate: endDate,
    });

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


router.get('/details/:userID', async (req, res) => {
  try {
      const userId = req.params.userID;

      // Query the database to get user details by ID
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Send user details as a JSON response
      res.json({
          success: true,
          user: {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              username: user.username
              // Add other fields as needed
          }
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.put('/:userId/education/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const { id } = req.params;
      const updatedUserProfile = await UserProfile.findOneAndUpdate(
        { 'userID': user._id, 'education._id': id },
        {
          $set: {
            'education.$': req.body,
          },
        },
        { new: true }
      );
  
      res.json(updatedUserProfile);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  

  router.delete('/:userID/education/:id', async (req, res) => {
    try {
        const userId = req.params.userID;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { id } = req.params;

        console.log('Deleting education with id:', id);

        const result = await UserProfile.findOneAndUpdate(
            { 'userID': user._id, 'education._id': id },
            { $pull: { education: { _id: id } } },
            { new: true }
        );

        // console.log("result after delete:", result)
        if (!result) {
            return res.status(404).json({ message: 'Education not found' });
        }

        const updatedUserProfile = await UserProfile.findById(user._id);
        res.json(updatedUserProfile);
    } catch (error) {
        console.error('Error deleting education:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

  
  
  

module.exports = router;
