const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const DatasetSchema = new Schema({
  _id: {
    type: NumberLong,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId, // https://stackoverflow.com/questions/32684927/mongoose-foreign-key
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
    type: Number,
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

module.exports = Dataset = mongoose.model("datasets", DatasetSchema);
