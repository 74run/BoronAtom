const mongoose = require('mongoose');
const EduSchema =  require('./EduModel');
const expSchema = require('./ExpModel');
const proSchema = require('./ProModel');
const certSchema = require('./CertModel');
const invSchema = require('./InvModel');
const SumSchema = require('./SumModel');
const skillSchema = require('./SkillModel');



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
    skills: [skillSchema] 

});


const UserProfile = mongoose.model('UserProfile', UserProfileSchema);

module.exports = UserProfile;