const mongoose = require('mongoose');

const proSchema = new mongoose.Schema({
    name: String,
    description: String,
});

const Pro = mongoose.model('Pro', proSchema);

module.exports = Pro;
