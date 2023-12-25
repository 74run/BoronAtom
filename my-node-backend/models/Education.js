const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  university: String,
  degree: String,
  graduationYear: String,
});

const Education = mongoose.model('Education', educationSchema);

module.exports = Education;
