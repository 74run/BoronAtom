const mongoose = require('mongoose');

const EduSchema = new mongoose.Schema({
  university: String,
  degree: String,
  graduationyear: String,
});

const Edu = mongoose.model('Edu', EduSchema);

module.exports = Edu;
