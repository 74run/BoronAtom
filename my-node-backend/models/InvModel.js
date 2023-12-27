const mongoose = require('mongoose');

const expSchema = new mongoose.Schema({
    organization: String,
    role: String,
    duration: String,
    description: String
});

const Inv = mongoose.model('Inv', expSchema);

module.exports = Inv;
