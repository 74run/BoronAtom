const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  username: String,
  password: String,
  confirmPassword: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
