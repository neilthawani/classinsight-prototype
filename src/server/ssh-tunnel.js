const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017";
var tunnel = require('tunnel-ssh');
const conf = require('./.tunnel-config');

const fs = require('file-system');
let privateKey;
var _db, _pdb;

try {
    privateKey = fs.readFileSync(keychain.keyPath);
} catch(e) {
    privateKey = "";
}

// SSH Tunnel Config
var config = {
    // Change
    username: conf.username,
    password: conf.password,
    // Usually in the form of /Users/*username*/.shh/id_rsa
    privateKey: privateKey,

    // Keep the same
    agent: process.env.SSH_AUTH_SOCK,
    host: conf.dbHost,
    port: 22, // ssh port
    dstPort: 27017
};

module.exports = {
    connectToServer: function(callback) {
        var server = tunnel(config, function (error, server) {
            if (error) {
                console.log("SSH connection error: " + error);
            } else {
                console.log("SSH Connection Successful");
            }

            MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
                if (err) {
                    console.log("Error connecting to database");
                }
                console.log("Connected to database");
                _db = client.db('classinsight-testdb');
                _pdb = client.db('cis-frontend-test');
                return callback(err);
            });
        });
    },
    getDb: function() {
        return _db;
    },
    getPDb: function() {
        return _pdb;
    }
}
