const mongoose = require('mongoose');

const expSchema = new mongoose.Schema({
  jobTitle: String,
  company: String,
  location: String,
  startDate: { month: String, year: String },
  endDate: { month: String, year: String },
  description: String,
});

const Exp = mongoose.model('Exp', expSchema);

module.exports = expSchema;
