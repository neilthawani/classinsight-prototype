const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const DatasetSchema = new Schema({
  // user_id: {
  userId: {
    type: Schema.Types.ObjectId, // https://stackoverflow.com/questions/32684927/mongoose-foreign-key
    ref: 'User'
  },
  // created_date: {
  createdDate: {
    type: Date,
    default: Date.now
  },
  // last_updated_date: {
  lastUpdatedDate: {
    type: Date,
    default: Date.now
  },
  filename: {
    type: String,
    required: true
  },
  // class_topic: {
  classTopic: {
    type: String,
    required: true
  },
  // class_date: {
  classDate: {
    type: String,
    required: true
  },
  // class_period: {
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
