const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
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
  datasets: [{ type: Schema.Types.ObjectId, ref: 'Dataset' }]
});

module.exports = User = mongoose.model("users", UserSchema);
