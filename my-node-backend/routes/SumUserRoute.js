const express = require('express');
const router = express.Router();

const UserProfile = require('../models/UserprofileModel');
const User = require('../models/UserModel');


router.post('/:userID/summary', async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.params.userID;


    let userProfile = await UserProfile.findOne({ userID: userId });

    if (!userProfile) {
      userProfile = new UserProfile({ userID: userId, summary: [] });
    }

    userProfile.summary.push({
      content: content,
     
    });

    const savedUserProfile = await userProfile.save();

    res.json(savedUserProfile);
  } catch (error) {
    console.error('Error saving summary:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:userId/summary', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userProfile = await UserProfile.findOne({ userID: user._id });

    if (!userProfile) {
      return res.status(404).json({ message: 'UserProfile not found' });
    }

    res.json(userProfile.summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:userId/summary/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const { id } = req.params;
      const updatedUserProfile = await UserProfile.findOneAndUpdate(
        { 'userID': user._id, 'summary._id': id },
        {
          $set: {
            'summary.$': req.body,
          },
        },
        { new: true }
      );
  
      res.json(updatedUserProfile);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  

  router.delete('/:userID/summary/:id', async (req, res) => {
    try {
        const userId = req.params.userID;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { id } = req.params;

        console.log('Deleting summary with id:', id);

        const result = await UserProfile.findOneAndUpdate(
            { 'userID': user._id, 'summary._id': id },
            { $pull: { summary: { _id: id } } },
            { new: true }
        );

        // console.log("result after delete:", result)
        if (!result) {
            return res.status(404).json({ message: 'summary not found' });
        }

        const updatedUserProfile = await UserProfile.findById(user._id);
        res.json(updatedUserProfile);
    } catch (error) {
        console.error('Error deleting summary:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

  
  
  

module.exports = router;
