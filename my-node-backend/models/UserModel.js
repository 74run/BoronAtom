const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,

  userProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserProfile',
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
