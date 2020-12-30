const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateDatasetInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.classTopic = !isEmpty(data.classTopic) ? data.classTopic : "";
  data.classPeriod = !isEmpty(data.classPeriod) ? data.classPeriod : "";

  // Empty checks
  if (Validator.isEmpty(data.classTopic)) {
    errors.classTopic = "Class topic missing";
  }

  if (Validator.isEmpty(data.classPeriod)) {
    errors.classPeriod = "Class period missing";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
