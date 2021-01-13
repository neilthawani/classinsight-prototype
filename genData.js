Old PR: https://github.com/neilthawani/classinsight-prototype/pull/242
Port 22 is for SSH.
Read these docs: https://www.npmjs.com/package/tunnel-ssh
Next steps: Come up with two table names - one for users, with a prefix (e.g., classinsight_users) and another table with min. 12-character passwords
Related nginx config for allowing large file sizes: https://github.com/neilthawani/classinsight-prototype/issues/245


const MongoClient = require("mongodb").MongoClient;
var assert = require("assert");
const url = "mongodb://localhost:27017";
var tunnel = require("tunnel-ssh"); // TODO: look into this package
const conf = require("./.tunnel-config");
const https = require("https");

// SSH Tunnel Config
var config = {
    // Change
    username: conf.username,
    // Usually in the form of /Users/*username*/.shh/id_rsa
    privateKey: require("fs").readFileSync(conf.key_path),
    password: conf.password,

    // Keep the same
    agent: process.env.SSH_AUTH_SOCK,
    host: conf.db_host,
    port: 22,
    dstPort: 27017
};

tunnel(config, function(error, server) {
    if (error) {
        console.log("SSH connection error: " + error);
    } else {
        console.log("SSH Connection Successful");
    }

MongoClient.connect(url, {
    useNewUrlParser: true
}, function(err, client) {
    if (err) {
        console.log("Error connecting to database");
    }

    console.log("Connected to database");
    _db = client.db("edusense-graphql-testdb"); // this is the last relevant line

    const data = JSON.stringify({"query": "keywordString: Search"}); // might not be necessary

    const options = {
        hostname: "ci-storage-1.andrew.cmu.edu",
        port: 3001,
        path: "/query",
        auth: "classinsight-phase1-beta:hashhere",
        method: "POST"
    };

    const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`);
        var bodyParts = [], bodyLength = 0;
        res.on("data", chunk => {
            bodyParts.push(chunk);
            bodyLength += chunk.length;
        });
        res.on("end", d => {
            // console.log("Found Sessions");
            var body = Buffer.alloc(bodyLength);
            var bodyPos = 0;
            for (var i = 0; i < bodyParts.length; i++) {
                bodyParts[i].copy(body, bodyPos, 0, bodyParts[i].length);
                bodyPos += bodyParts[i].length;
            }
            // ... etc
        });
    });
);
