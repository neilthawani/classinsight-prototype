const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  _id: {
    type: NumberLong,
    required: true
  },
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
  },
  userType: {
    type: Number,
    default: 50
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = User = mongoose.model("users", UserSchema);
