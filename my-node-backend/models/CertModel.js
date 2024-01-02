const mongoose = require('mongoose');

const expSchema = new mongoose.Schema({
    name: String,
    issuedBy: String,
    issuedDate: { month: String, year: String },
    expirationDate: { month: String, year: String },
    url: String,
});

const Cert = mongoose.model('Cert', expSchema);

module.exports = Cert;
