const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateDatasetInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.classTopic = !isEmpty(data.classTopic) ? data.classTopic : "";
  // data.lessonName = !isEmpty(data.lessonName) ? data.lessonName : "";
  data.classPeriod = !isEmpty(data.classPeriod) ? data.classPeriod : "";

  // Empty checks
  if (Validator.isEmpty(data.classTopic)) {
    errors.classTopic = "Class topic missing";
  }

  // if (Validator.isEmpty(data.lessonName)) {
  //   errors.lessonName = "Lesson name missing";
  // }

  if (Validator.isEmpty(data.classPeriod.toString())) {
    errors.classPeriod = "Class period missing";
  }

  if (isNaN(parseInt(data.classPeriod, 10)) && !data.classPeriod.includes(",")) {
      errors.classPeriod = "Class period invalid";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
