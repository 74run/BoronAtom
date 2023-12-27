const mongoose = require('mongoose');

const expSchema = new mongoose.Schema({
  jobTitle: String,
  company: String,
  location: String,
  duration: String,
  description: String,
});

const Exp = mongoose.model('Exp', expSchema);

module.exports = Exp;
