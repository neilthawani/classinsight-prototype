// const mongoose = require("mongoose");
const mongoose = require('mongoose/browser');

const AutoIncrement = require('mongoose-sequence')(mongoose);
// Developer's note:
// AutoIncrement causes these warnings:
// [0] (node:7835) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
// [0] (node:9503) DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to false are deprecated. See: https://mongoosejs.com/docs/deprecations.html#findandmodify

const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  _id: {
    type: Number
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

UserSchema.plugin(AutoIncrement, {id: "users_id_counter", inc_field: '_id'});

module.exports = User = mongoose.model("users", UserSchema);
