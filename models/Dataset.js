const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const DatasetSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId, // https://stackoverflow.com/questions/32684927/mongoose-foreign-key
    ref: 'User'
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  last_updated_date: {
    type: Date,
    default: Date.now
  },
  filename: {
    type: String,
    required: true
  },
  class_topic: {
    type: String,
    required: true
  },
  class_date: {
    type: String,
    required: true
  },
  class_period: {
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
