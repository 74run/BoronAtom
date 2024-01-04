const mongoose = require('mongoose');

const EduSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  university: String,
  degree: String,
  major: String,
  startDate: { month: String, year: String },
  endDate: { month: String, year: String },
});

const Edu = mongoose.model('Edu', EduSchema);

module.exports = Edu;
