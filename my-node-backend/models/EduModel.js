const mongoose = require('mongoose');

const EduSchema = new mongoose.Schema({
  university: String,
  universityUrl: String,
  cgpa: String,
  degree: String,
  major: String,
  startDate: { month: String, year: String },
  endDate: { month: String, year: String },
  
  includeInResume: { type: Boolean, default: true },
  isPresent: { type: Boolean, default: false },
});

// const Edu = mongoose.model('Edu', EduSchema);

module.exports = EduSchema;
