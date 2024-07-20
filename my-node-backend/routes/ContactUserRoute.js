const express = require('express');
const router = express.Router();

const UserProfile = require('../models/UserprofileModel');
const User = require('../models/UserModel');

router.post('/:userID/contact', async (req, res) => {
    try {
        const { name, email, phoneNumber, linkedIn } = req.body;
        const userId = req.params.userID;
  
    //   if (!university || !degree || !major || !startDate || !endDate) {
    //     return res.status(400).json({ error: 'All fields are required' });
    //   }
  
      let userProfile = await UserProfile.findOne({ userID: userId });
  
      if (!userProfile) {
        userProfile = new UserProfile({ userID: userId, contact: [] });
      }
  
      userProfile.contact.push({
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        linkedIn: linkedIn,
        
      });
  
      const savedUserProfile = await userProfile.save();
  
      res.json(savedUserProfile);
    } catch (error) {
      console.error('Error saving contact:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  router.get('/:userID/contact', async (req, res) => {
    try {
      const user = await User.findById(req.params.userID);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const userProfile = await UserProfile.findOne({ userID: user._id });
  
      if (!userProfile) {
        return res.status(404).json({ message: 'UserProfile not found' });
      }
  
      res.json(userProfile.contact);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  router.put('/:userID/contact/:contactID', async (req, res) => {
    try {
        const { userID, contactID } = req.params;

        const { name, email, phoneNumber, linkedIn } = req.body;

        let userProfile = await UserProfile.findOne({ userID });

        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        const contactToUpdate = userProfile.contact.find(contact => contact._id.toString() === contactID);

        if (!contactToUpdate) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        // Update the contact details
        contactToUpdate.name = name;
        contactToUpdate.email = email;
        contactToUpdate.phoneNumber = phoneNumber;
        contactToUpdate.linkedIn = linkedIn;

        const updatedUserProfile = await userProfile.save();

        res.json(updatedUserProfile);
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


    
  
    router.delete('/:userID/contact/:id', async (req, res) => {
      try {
          const userId = req.params.userID;
          const user = await User.findById(userId);
  
          if (!user) {
              return res.status(404).json({ message: 'User not found' });
          }
  
          const { id } = req.params;
  
          // console.log('Deleting contact with id:', id);
  
          const result = await UserProfile.findOneAndUpdate(
              { 'userID': user._id, 'contact._id': id },
              { $pull: { contact: { _id: id } } },
              { new: true }
          );
  
          // console.log("result after delete:", result)
          if (!result) {
              return res.status(404).json({ message: 'contact not found' });
          }
  
          const updatedUserProfile = await UserProfile.findById(user._id);
          res.json(updatedUserProfile);
      } catch (error) {
          console.error('Error deleting contact:', error.message);
          res.status(500).json({ message: 'Internal Server Error' });
      }
  });
  
    
    
    
  
  module.exports = router;