const mongoose = require('mongoose');

const EduSchema = new mongoose.Schema({
  university: String,
  cgpa: String,
  degree: String,
  major: String,
  startDate: { month: String, year: String },
  endDate: { month: String, year: String },
});

// const Edu = mongoose.model('Edu', EduSchema);

module.exports = EduSchema;
