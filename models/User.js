const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  googleId: String,
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("users", UserSchema);

// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
//
// const userSchema = new Schema({
//     username: String,
//     googleId: String,
//     thumbnail: String
// });
//
// const User = mongoose.model('user', userSchema);
//
// module.exports = User;
