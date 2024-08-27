const mongoose = require('mongoose');
const EduSchema =  require('./EduModel');
const expSchema = require('./ExpModel');
const proSchema = require('./ProModel');
const certSchema = require('./CertModel');
const invSchema = require('./InvModel');
const SumSchema = require('./SumModel');
const skillSchema = require('./SkillModel');
const contactSchema = require('./ContactModel');



const UserProfileSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
      },


  
    summary: [SumSchema], 
    education: [EduSchema],
    experience: [expSchema],
    project: [proSchema],
    certification: [certSchema],
    involvement: [invSchema],
    skills: [skillSchema],
    contact: [contactSchema],
    image: {
      type: Buffer,  // You can use String if you want to store it as Base64
      contentType: String, // To store the image MIME type (e.g., 'image/png')
  }

});


const UserProfile = mongoose.model('UserProfile', UserProfileSchema);

module.exports = UserProfile;