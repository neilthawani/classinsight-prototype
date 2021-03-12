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
        // const db = client.db("edusense-graphql-testdb");

        // const users = require("./routes/api/users");
        // const datasets = require("./routes/api/datasets");
        // app.use("/api/users", users);
        // app.use("/api/datasets", datasets);

        // GET: Sample frame collection
        app.post('/api/users/register', function(req, res){
            console.log("req", req);
            return { errors: { username: "hello" }}
        //     // Get sample collection
        //     db.collection('session-5f11e488dab4eb718a819779-classinsight-graphql-video', function(err, collection){
        //         collection.find().toArray(function(err, items){
        //             if(err){throw err}
        //             else{
        //                 res.send(items[1]);
        //                 // console.log(items[1])
        //             };
        //             // console.log(items[1]);
        //         });
        //     })
        });

        // Connect to front end data db on server
        // const pd_db = client.db("frontend-test");

        // // GET: User data for PD Modules
        // app.get('/api/getPDProgress', function(req, res){
        //     // Get sample collection
        //     pd_db.collection('pds', function(err, collection){
        //         collection.find().toArray(function(err, items){
        //             if(err){throw err}
        //             else{
        //                 res.send(items);
        //                 // console.log(items[1])
        //             };
        //             // console.log(items[1]);
        //         });
        //     });
        // });
        //
        // // POST: Store PD goal data in db
        // app.post('/api/setGoal', function(req, res){
        //
        //     pd_db.collection("goals").insertOne({ nextWeek: req.body.nextWeek }, function(err, res){
        //         if(err) throw err;
        //         console.log("Doc insterted!");
        //     });
        // });

    });
        // client.close();


});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
