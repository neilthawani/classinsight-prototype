// To install and run MongoDB on Mac:
// https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/
// Note that the param `compressors=disabled&` is removed from mongoURI below due to error in Terminal:
// { MongoParseError: Value for `compressors` must be at least one of: `snappy`, `zlib`

// To run:
// mongo
// nodemon run server

module.exports = {
    mongoURI: "mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb",
    secretOrKey: "secret"
};
