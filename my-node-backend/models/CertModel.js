const mongoose = require('mongoose');

const certSchema = new mongoose.Schema({
    name: String,
    issuedBy: String,
    issuedDate: { month: String, year: String },
    expirationDate: { month: String, year: String },
    url: String,
    includeInResume: { type: Boolean, default: true },
});

// const Cert = mongoose.model('Cert', certSchema);

module.exports = certSchema;
