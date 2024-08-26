
const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    domain: String,
    name: String,
    includeInResume: { type: Boolean, default: true },
  });
  

  module.exports = skillSchema;