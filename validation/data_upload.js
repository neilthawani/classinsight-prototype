const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateDatasetInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.class_topic = !isEmpty(data.class_topic) ? data.class_topic : "";
  data.class_period = !isEmpty(data.class_period) ? data.class_period : "";

  // Empty checks
  if (Validator.isEmpty(data.class_topic)) {
    errors.class_topic = "Class topic is required";
  }

  if (Validator.isEmpty(data.class_period)) {
    errors.class_period = "Class period(s) is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
