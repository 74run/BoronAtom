const mongoose = require('mongoose');

const expSchema = new mongoose.Schema({
  jobTitle: String,
  company: String,
  companyUrl: String,
  location: String,
  description: String,
  startDate: { month: String, year: String },
  endDate: { month: String, year: String },
  includeInResume: { type: Boolean, default: true },
  isPresent: { type: Boolean, default: false },
});

// const Exp = mongoose.model('Exp', expSchema);

module.exports = expSchema;
