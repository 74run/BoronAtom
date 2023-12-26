const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  university: String,
  degree: String,
  graduationyear: String,
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
