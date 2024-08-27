const mongoose = require('mongoose');

const PendingUserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  username: String,
  password: String,
  confirmPassword: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600 // Optional: Set TTL to automatically delete unverified users after 1 hour
  }
});

const PendingUser = mongoose.model('PendingUser', PendingUserSchema);

module.exports = PendingUser;

