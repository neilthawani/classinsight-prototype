module.exports = {
    async up(db, client) {
        // TODO write your migration here.
        // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
        return db.collection('datasets').updateMany({}, {
            $rename: {
                user_id: "userId",
                created_date: "createdDate",
                last_updated_date: "lastUpdatedDate",
                class_topic: "classTopic",
                class_date: "classDate",
                class_period: "classPeriod"
            }
        });
    },

    async down(db, client) {
        // TODO write the statements to rollback your migration (if possible)
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
        return db.collection('datasets').updateMany({}, {
            $rename: {
                userId: "user_id",
                createdDate: "created_date",
                lastUpdatedDate: "last_updated_date",
                classTopic: "class_topic",
                classDate: "class_date",
                classPeriod: "class_period"
            }
        });
    }
};
