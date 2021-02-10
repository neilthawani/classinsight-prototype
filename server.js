const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
// TODO: what is dotenv? is it useful?
// TODO: what is cookie-parser? is it useful?

const users = require("./routes/api/users");
const datasets = require("./routes/api/datasets");

const initializeDb = require('./ssh-tunnel').connectToServer;

const app = express();

// Bodyparser middleware
app.use(bodyParser.json());

app.use(express.static('dist'));

app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({extended: true, limit: '25mb'}));

// TODO: CORS options go here for cookie-parser?

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);
app.use("/api/datasets", datasets);

const port = 8802 || process.env.PORT; // process.env.port is Heroku's port if you choose to deploy the app there
// Developer's note:
// Run `killall node` in the Terminal if server doesn't refresh successfully and says EADDRINUSE.

initializeDb(function(err) {
    app.listen(port, () => console.log(`Server up and running on port ${port} !`));
});
