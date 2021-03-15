const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

// Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const validateEditUser = require("../validation/edit");
const validatePasswordInput = require("../validation/reset-password");

// Load User model
const User = require("../models/User");

module.exports = function(router, basePath, db) {
    // @route POST api/users/reset-password
    // @desc Reset user password
    // @access Public
    router.post(`${basePath}/reset-password`, (req, res) => {
        // Form validation
        const {
            errors,
            isValid
        } = validatePasswordInput(req.body);

        // Check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
                if (err) throw err;
                var newPassword = hash;

                const _id = req.body.userId;
                var byQuery = {
                    _id: mongoose.Types.ObjectId(_id)
                };
                let toUpdate = {
                    'password': newPassword
                };

                var options = {
                    returnNewDocument: true,
                    useFindAndModify: false
                };

                db.collection('users', function(error, collection) {
                    collection.findOneAndUpdate(byQuery, {
                        $set: toUpdate
                    }, options, function(err, result) {
                        if (err) {
                            return res.status(400).json({
                                message: 'Unable to update user.'
                            });
                        } else {
                            return res.status(200).json({
                                message: 'User updated successfully. Refreshing data...',
                                user: result
                            });
                        }
                    });
                });
            });
        });
    });

    // @route POST api/users/register
    // @desc Register user
    // @access Public
    router.post(`${basePath}/register`, (req, res) => {
        // Form validation
        const {
            errors,
            isValid
        } = validateRegisterInput(req.body);

        // Check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        db.collection('users', function(err, collection) {
            collection.findOne({
                email: req.body.email
            }).then(user => {
                if (user) {
                    return res.status(400).json({
                        email: "Email already exists"
                    });
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        userType: req.body.userType,
                        password: req.body.password
                    });

                    // Hash password before saving in database
                    bcrypt.genSalt(10, (err, salt) => {
                        // console.log('bcrypt');
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;

                            newUser.password = hash;
                            collection.save(newUser)
                                .then(user => {
                                    // console.log('user', user);
                                    res.json(user)
                                })
                                .catch(err => console.log(err));
                        });
                    });
                }
            });
        });
    });

    // @route GET api/users/show
    // @desc Retrieve user from Users table
    // @access Public
    router.get(`${basePath}/show`, (req, res) => {
        // console.log('show');
        const id = mongoose.Types.ObjectId(req.query.userId)

        db.collection('users', function(error, collection) {
            collection.findOne({
                _id: id
            }).then(user => {
                if (user) {
                    // console.log('user', user);
                    return res.status(200).json({
                        message: "User found",
                        user: user
                    });
                } else {
                    return res.status(400).json({
                        nouser: `There is no user with id: ${req.body.userId}`
                    });
                }
            });
        });
    });

    // @route POST api/users/edit
    // @desc Edit user in Users table
    // @access Public
    router.post(`${basePath}/edit`, (req, res) => {
        // console.log('edit');
        const {
            errors,
            isValid
        } = validateEditUser(req.body.user);

        if (!isValid) {
            return res.status(400).json(errors);
        }

        const _id = req.body.user._id;
        var byQuery = {
            _id: mongoose.Types.ObjectId(_id)
        };
        let toUpdate = {
            'name': req.body.user.name,
            'email': req.body.user.email,
            'userType': req.body.user.userType
        };

        var options = {
            returnNewDocument: true,
            useFindAndModify: true,
            upsert: true,
            updateExisting: true
        };

        db.collection('users', function(error, collection) {
            collection.findOneAndUpdate(byQuery, {$set: toUpdate}, options).then(function(result, error) {
                // console.log('error', error, 'result', result);
                if (error) {
                    return res.status(400).json({
                        message: 'Unable to update user.'
                    });
                } else {
                    return res.status(200).json({
                        message: 'User updated successfully. Refreshing data...',
                        user: result
                    });
                }
            });
        });
    });

    // @route POST api/users/delete
    // @desc Delete user from Users table
    // @access Public
    router.post(`${basePath}/delete`, (req, res) => {
        const id = req.body.user._id;

        var byQuery = {
            _id: mongoose.Types.ObjectId(id)
        };
        let toUpdate = {
            'isActive': false
        };

        var options = {
            returnNewDocument: true,
            useFindAndModify: true,
            upsert: true,
            updateExisting: true
        };

        db.collection('users', function(error, collection) {
            collection.findOneAndUpdate(byQuery, {$set: toUpdate}, options).then(function(user, error) {
                if (user) {
                    return res.status(200).json({
                        message: "User deleted",
                        user: req.body.user
                    });
                } else {
                    return res.status(400).json({
                        nouser: `There is no user with id: ${req.body.user._id}`
                    });
                }
            });
        });
    });

    // @route GET api/users/list
    // @desc List all users
    // @access Public
    router.get(`${basePath}/list`, function(req, res) {
        db.collection('users', function(err, collection) {
            collection.find().toArray(function(error, users) {
                var parsedUsers = users.map((user) => {
                    if (user.isActive) {
                        return {
                            _id: user._id,
                            userType: user.userType,
                            name: user.name,
                            email: user.email
                        }
                    }
                })
                res.send(parsedUsers);
            });
        });
    });

    // @route POST api/users/login
    // @desc Login user and return JWT token
    // @access Public
    router.post(`${basePath}/login`, (req, res) => {
        // console.log('login');
        // Form validation
        const {
            errors,
            isValid
        } = validateLoginInput(req.body);

        // Check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        const email = req.body.email;
        const password = req.body.password;

        // Find user by email
        db.collection('users', function(err, collection) {
            collection.findOne({
                email
            }).then(user => {
                // Check if user exists
                if (!user) {
                    return res.status(404).json({
                        emailnotfound: "Email not found"
                    });
                }

                // Check password
                bcrypt.compare(password, user.password).then(isMatch => {
                    if (isMatch) {
                        // User matched
                        // Create JWT Payload
                        const payload = {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            userType: user.userType
                        };

                        // Sign token
                        jwt.sign(
                            payload,
                            keys.secretOrKey, {
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
                            .json({
                                passwordincorrect: "Password incorrect"
                            });
                    }
                });
            });
        });
    });

    // @route POST api/users/google-login
    // @desc Login user with Google SSO and return token
    // @access Public
    router.post(`${basePath}/google-login`, (req, res) => {
        // console.log('google login');
        var email = req.body.profileObj.email;
        var tokenId = req.body.tokenId;

        db.collection('users', function(err, collection) {
            collection.findOne({
                email
            }).then(user => {
                if (!user) {
                    return res.status(404).json({
                        emailnotfound: "Email not found"
                    });
                }

                // console.log('user', user);
                const payload = {
                    id: user._id, // parseInt(user.id, 10),
                    name: user.name,
                    email: user.email,
                    userType: user.userType,
                    isGoogleUser: true
                };

                // Sign token
                jwt.sign(
                    payload,
                    tokenId, {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    }
                );
            });
        });
    });
}
