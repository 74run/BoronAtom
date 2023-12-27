const mongoose = require('mongoose');

const expSchema = new mongoose.Schema({
    name: String,
    issuedBy: String,
    issuedDate: String,
    expirationDate: String,
});

const Cert = mongoose.model('Cert', expSchema);

module.exports = Cert;
