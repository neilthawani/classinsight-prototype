const User = require("../models/User");
const Dataset = require("../models/Dataset");

module.exports = {
    async up(db, client) {
        // TODO write your migration here.
        // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
        db.collection('users').find().forEach(function (doc) {
            db.collection('users').remove({ _id : doc._id});
            tempId = new NumberLong(doc._id);
            doc._id = tempId;
            db.collection('users').save(doc);
        });

        db.collection('datasets').find().forEach(function (doc) {
            db.collection('datasets').remove({ _id : doc._id});
            tempId = new NumberLong(doc._id);
            doc._id = tempId;
            db.collection('datasets').save(doc);
        });
    },

    async down(db, client) {
        // TODO write the statements to rollback your migration (if possible)
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    }
};
