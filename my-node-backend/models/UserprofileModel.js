const mongoose = require('mongoose');


const EduSchema = new mongoose.Schema({
    university: String,
    degree: String,
    major: String,
    startDate: { month: String, year: String },
    endDate: { month: String, year: String },
  });

const UserProfileSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
      }, 
    education: [EduSchema]
});


const UserProfile = mongoose.model('UserProfile', UserProfileSchema);

module.exports = UserProfile;