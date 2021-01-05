const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);
// Developer's note:
// AutoIncrement causes this warning:
// [0] (node:7835) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.

const Schema = mongoose.Schema;
// var NumberLong = Schema.Types.Long;

// Create Schema
const UserSchema = new Schema({
  _id: {
    type: Number,
    // required: true
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

// UserSchema.plugin(AutoIncrement);//, {inc_field: 'id'});
UserSchema.plugin(AutoIncrement, {id: "users_id_counter", inc_field: '_id'});

module.exports = User = mongoose.model("users", UserSchema);
