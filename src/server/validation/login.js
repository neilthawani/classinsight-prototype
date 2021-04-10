const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.usernameOrEmail = !isEmpty(data.usernameOrEmail) ? data.usernameOrEmail : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // Email checks
  if (Validator.isEmpty(data.usernameOrEmail)) {
    errors.email = "Username or email is required";
  }
  // else if (!Validator.isEmail(data.usernameOrEmail)) {
  //   errors.email = "Email is invalid";
  // }
  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
