const mongoose = require('mongoose');

const proSchema = new mongoose.Schema({
    name: String,
    startDate: { month: String, year: String },
    endDate: { month: String, year: String },
    skills: String,
    description: String,
});

// const Pro = mongoose.model('Pro', proSchema);

module.exports = proSchema;
