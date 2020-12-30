const Counter = require("../models/Counter");

module.exports = {
    async up(db, client) {
        // TODO write your migration here.
        // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
        db.collection("counters").insert(
           {
              dbName: "users",
              count: 0
           }
        );

        db.collection("counters").insert(
           {
              dbName: "datasets",
              count: 0
           }
        );
    },

    async down(db, client) {
        // TODO write the statements to rollback your migration (if possible)
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    }
};
