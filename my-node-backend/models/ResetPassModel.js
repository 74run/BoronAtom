const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create User schema
const userSchema = new Schema({
    email: String
});

const ResetPassModel = mongoose.model(
    "ResetPassModel"
    ,userSchema
);

module.exports = ResetPassModel;