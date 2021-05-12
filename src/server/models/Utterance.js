const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);
// Developer's note:
// AutoIncrement causes this warning:
// [0] (node:7835) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
// [0] (node:9503) DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to false are deprecated. See: https://mongoosejs.com/docs/deprecations.html#findandmodify

const Schema = mongoose.Schema;

// Create Schema
const UtteranceSchema = new Schema({
  filename: {
    type: String,
    required: false
  },
  instructor: {
    type: String,
    required: false
  },
  lessonName: {
    type: String,
    required: false
  },
  classPeriod: {
    type: Array,
    required: false
  },
  classTopic: {
    type: String,
    required: false
  },
  breakoutRoom: {
    type: String,
    required: false
  },
  speakerPseudonym: {
    type: String,
    required: false
  },
  utteranceCodes: {
    type: Array,
    required: false
  },
  comments: {
    type: String,
    required: false
  },
  episodes: {
    type: String,
    required: false
  },
  sequences: {
    type: String,
    required: false
  },
  timestamp: {
    type: String,
    required: false
  },
  id: {
    type: String,
    required: true
  },
  utterance: {
    type: String,
    required: false
  },
});

UtteranceSchema.plugin(AutoIncrement, {id: "utterances_id_counter", inc_field: '_id'});
module.exports = Utterance = mongoose.model("utterances", UtteranceSchema);
