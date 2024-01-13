const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create User schema
const userSchema = new Schema({
    email: String
});

const ForgotPassModel = mongoose.model(
    "ForgotPassModel"
    ,userSchema
);

module.exports = ForgotPassModel;