const mongoose = require('mongoose');

const invSchema = new mongoose.Schema({
    organization: String,
    role: String,
    startDate: { month: String, year: String },
    endDate: { month: String, year: String },
    description: String
});

const Inv = mongoose.model('Inv', invSchema);

module.exports = invSchema;
