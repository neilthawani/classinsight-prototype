const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");

const app = express();

const keys = require('./config/keys');

// Bodyparser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose.connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log("MongoDB successfully connected"))
.catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);

const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there

// Google OAuth login/registration
// app.get('/auth/google',
//     passport.authenticate('google', { scope: keys.oauth.scope });
// );
//
// app.get('/auth/google/callback',
//     passport.authenticate('google', { failureRedirect: '/login' }),
//     function(req, res) {
//         var href = window.location.origin;
//         res.redirect(href);
//     }
// );

app.listen(port, () => {
    console.log(`Server up and running on port ${port}!`);
});
