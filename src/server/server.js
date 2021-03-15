// Imports
const express = require('express');
const os = require('os');
tunnel = require('tunnel-ssh');
mongoose = require('mongoose');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert')
const fs = require('fs');

// SSH Tunnel Config
var config = {
    username:'neil',
    host:'edusense-dev-1.andrew.cmu.edu',
    agent : process.env.SSH_AUTH_SOCK,
    privateKey:require('fs').readFileSync('/Users/neilthawani/.ssh/id_rsa'),
    port:22,
    dstPort:27017,
    password:'youdownwithrpp'
};

// Configure express app
const app = express();
var jsonParser = bodyParser.json()
app.use(express.static('dist'));
app.use(jsonParser);


// require('./routes/datasets')(app);

// GET: PD Modules
// var pd_mod = fs.readFileSync("src/client/resources/testmd.md", "utf8");
// app.get('/api/getPD', (req, res) => res.send({ module: pd_mod }));

// SSH tunnel to database
var server = tunnel(config, function (error, server) {
    if(error){
        console.log("SSH connection error: " + error);
    } else{
        console.log("SSH Connection Successful");
    }

    // Connect to Mongo server
    MongoClient.connect("mongodb://localhost:27017", function (err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        // Connect to classroom data db on server
        const db = client.db('classinsight-testdb');
        const pdb = client.db('cis-frontend-test');

        require('./routes/users')(app, '/api/users', db);
        require('./routes/datasets')(app, '/api/datasets', db);
    });
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
