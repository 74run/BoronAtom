const mongoose = require('mongoose');

const SumSchema = new mongoose.Schema({
  content: String,
});



module.exports = SumSchema;