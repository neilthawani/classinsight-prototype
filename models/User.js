const mongoose = require("mongoose");
require("mongoose-long")(mongoose);

const Schema = mongoose.Schema;
var NumberLong = Schema.Types.Long;

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
