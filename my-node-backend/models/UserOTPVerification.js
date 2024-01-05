const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create User schema
const userSchema = new Schema({
    userId: String,
    otp: String,
    createdAt: Date,
    expiresAt: Date,
});

const UserOTPVerification = mongoose.model(
    "UserOTPVerification"
    ,userSchema
);

module.exports = UserOTPVerification;
