
const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    domain: String,
    name: String,
  });
  

  module.exports = skillSchema;