const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true 
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobile: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'student'
  },
  date: {
    type: Date,
    default: Date.now
  },



  otp: {
    type: String,
    default: null 
  },
  isVerified: {
    type: Boolean,
    default: false 
  }


});

const User = mongoose.model('User', UserSchema);

module.exports = User;