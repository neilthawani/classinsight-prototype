module.exports = {
    async up(db, client) {
        return db.collection('users').updateMany({}, { $set: { userType: 50 } });
    },

    async down(db, client) {
        return db.collection('users').updateMany({}, { $unset: { userType: null } });
    }
};
