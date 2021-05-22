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
var config = require('./.tunnel-config');

// Configure express app
const app = express();
app.use(express.static('dist'));

// SSH tunnel to database
var server = tunnel(config, function (error, server) {
    if(error){
        console.log("SSH connection error: " + error);
    } else{
        console.log("SSH Connection Successful");
    }

    // Connect to Mongo server
    MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, function (err, client) {
        app.use(express.json({limit: '100mb'}));
        app.use(express.urlencoded({limit: '100mb'}));
        app.use(bodyParser.json({limit: '100mb'}));
        app.use(bodyParser.urlencoded({limit: '100mb', parameterLimit: 10000, extended: true}));
        app.use(bodyParser.text({limit: '100mb'}));

        assert.equal(null, err);
        console.log("Connected successfully to server");

        // Connect to classroom data db on server
        const db = client.db('classinsight-testdb');
        const pdb = client.db('cis-frontend-test');

        require('./routes/users')(app, '/api/users', db);
        require('./routes/datasets')(app, '/api/datasets', db);
    });
});

app.listen(process.env.PORT || 8802, () => console.log(`Listening on port ${process.env.PORT || 8802}!`));
