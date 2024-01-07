const mongoose = require('mongoose');

const invSchema = new mongoose.Schema({
    organization: String,
    role: String,
    duration: String,
    description: String
});

const Inv = mongoose.model('Inv', invSchema);

module.exports = invSchema;
