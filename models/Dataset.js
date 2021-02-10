// const mongoose = require("mongoose");
const mongoose = require('mongoose/browser');

const AutoIncrement = require('mongoose-sequence')(mongoose);
// Developer's note:
// AutoIncrement causes this warning:
// [0] (node:7835) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
// [0] (node:9503) DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to false are deprecated. See: https://mongoosejs.com/docs/deprecations.html#findandmodify

const Schema = mongoose.Schema;

// Create Schema
const DatasetSchema = new Schema({
  _id: {
    type: Number
  },
  userId: {
    type: Schema.Types.Number, // https://stackoverflow.com/questions/32684927/mongoose-foreign-key
    ref: 'User'
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  lastUpdatedDate: {
    type: Date,
    default: Date.now
  },
  filename: {
    type: String,
    required: true
  },
  classTopic: {
    type: String,
    required: true
  },
  classDate: {
    type: String,
    required: true
  },
  classPeriod: {
    type: Array,
    required: true
  },
  jsonData: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false
  }
});

DatasetSchema.plugin(AutoIncrement, {id: "datasets_id_counter", inc_field: '_id'});
module.exports = Dataset = mongoose.model("datasets", DatasetSchema);
