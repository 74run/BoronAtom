const mongoose = require('mongoose');

const invSchema = new mongoose.Schema({
    organization: String,
    role: String,
    startDate: { month: String, year: String },
    endDate: { month: String, year: String },
    description: String,
    includeInResume: { type: Boolean, default: true },
});

// const Inv = mongoose.model('Inv', invSchema);

module.exports = invSchema;
