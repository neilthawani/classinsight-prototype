const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateEditUser = require("../../validation/edit");

// Load User model
const User = require("../../models/User");

// @route POST api/users/edit
// @desc Edit user in Users table
// @access Public
router.post('/edit', (req, res) => {
    const id = req.body.user._id;
    const { errors, isValid } = validateEditUser(req.body.user);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const _id = req.body.user._id;
    var byQuery = { _id: _id };
    let toUpdate = { 'name': req.body.user.name, 'email': req.body.user.email, 'userType': req.body.user.userType };
    var options = { returnNewDocument: true, useFindAndModify: false };

    User.findOneAndUpdate(byQuery, {$set: toUpdate}, options, function(err, result) {
        if (err) {
            return res.status(400).json({ message: 'Unable to update user.' });
        } else {
            return res.status(200).json({ message: 'User updated successfully. Refreshing data...', user: result });
        }
    });
});

// @route POST api/users/delete
// @desc Delete user from Users table
// @access Public
router.post('/delete', (req, res) => {
    const id = req.body.user._id;
    User.deleteOne({ _id: id }).then(user => {
        if (user) {
            return res.status(200).json({ message: "User deleted", user: req.body.user });
        } else {
            return res.status(400).json({ nouser: `There is no user with id: ${req.body.user._id}` });
        }
    });
});

// @route GET api/users/list
// @desc List all users
// @access Public
router.get('/list', function(req, res) {
    User.find({}, function(error, users) {
        res.send(users);
    });
});

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        userType: req.body.userType,
        password: req.body.password
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

module.exports = router;
