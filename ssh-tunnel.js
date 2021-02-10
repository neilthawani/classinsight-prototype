const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017";
var tunnel = require('tunnel-ssh');
const keychain = require('./keychain');
const fs = require('fs');
let privateKey;

try {
  privateKey = fs.readFileSync(keychain.keyPath);
} catch(e) {
  privateKey = "";
}

// SSH Tunnel Config
var config = {
    // Change
    username: keychain.username,
    // Usually in the form of /Users/*username*/.shh/id_rsa
    privateKey: privateKey,
    password: keychain.password,

    // Keep the same
    agent: process.env.SSH_AUTH_SOCK,
    host: keychain.dbHost,
    port: 22, // ssh port
    dstPort: 27017
};

module.exports = {
    connectToServer: function (callback) {
        var server = tunnel(config, function (error, server) {
            if (error) {
                console.log("SSH connection error: " + error);
            } else {
                console.log("SSH Connection Successful");
            }

            MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
                if(err){
                    console.log("Error connecting to database");
                }
                console.log("Connected to database");
                _db = client.db('classinsight');
                _pdb = client.db('frontend-test');
                return callback(err);
            });
        });
    },

    getDb: function () {
        return _db;
    },

    getPDb: function () {
        return _pdb;
    }
};
