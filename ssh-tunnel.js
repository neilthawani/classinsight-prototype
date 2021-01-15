const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017";
var tunnel = require('tunnel-ssh');
const keychain = require('./keychain');

// SSH Tunnel Config
var config = {
    // Change
    username: keychain.username,
    // Usually in the form of /Users/*username*/.shh/id_rsa
    privateKey: require('fs').readFileSync(keychain.keyPath),
    password: keychain.password,

    // Keep the same
    agent: process.env.SSH_AUTH_SOCK,
    host: keychain.dbHost,
    port: 22, // ssh port
    dstPort: 27017
};

tunnel(config, function (error, server) {
    if (error) {
        console.log("SSH connection error: " + error);
    } else {
        console.log("SSH Connection Successful");
    }

    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        if (err) {
            console.log("Error connecting to database");
        }
        console.log("Connected to database");
        _db = client.db('classinsight');
});
