const express = require("express");
const dotenv = require('dotenv');

const bodyParser = require("body-parser");
const cors = require('cors');
const passport = require("passport");
const cookieParser = require('cookie-parser');
const initializeDb = require('./ssh-tunnel').connectToServer;
const conf = require('./.tunnel-config');
const mongoose = require("mongoose");

// Configure dotenv
dotenv.config();

// const mongoose = require("mongoose");
const app = express();

// Bodyparser middleware
app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(cookieParser());


var corsOptions = {
    origin: conf.allowed_domains, // TODO: need this from Nikhil
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token', 'Authorization'],
    origin: 'http://localhost:3000',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
}
app.use(cors(corsOptions));

// Passport middleware
require("./config/passport")(passport); // Passport config
app.use(passport.initialize());
app.use(passport.session());

const users = require("./routes/api/users");
const datasets = require("./routes/api/datasets");

// Routes
app.use("/api/users", users);
app.use("/api/datasets", datasets);

// var httpProxy = require('http-proxy');
// var apiProxy = httpProxy.createProxyServer();

// app.use(express.json({limit: '25mb'}));
// app.use(express.urlencoded({extended: true, limit: '25mb'}));

// TODO: CORS options go here for cookie-parser?

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
// TODO: Uncomment in prod?
mongoose
  .connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

const port = 8802 || process.env.PORT; // process.env.port is Heroku's port if you choose to deploy the app there
// Developer's note:
// Run `killall node` in the Terminal if server doesn't refresh successfully and says EADDRINUSE.

// app.all("/api/*", function(req, res) {
//     apiProxy.web(req, res, {target: 'http://localhost:3000'});
// });

// TODO: initializeDb is the SSH tunnel
initializeDb(function(err) {
    app.listen(port, () => console.log(`Server up and running on port ${port} !`));
});
