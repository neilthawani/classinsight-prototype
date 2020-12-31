module.exports = {
    async up(db, client) {
        db.users.find().forEach(function (doc) {
            db.users.remove({ _id : doc._id});
            tempId = new NumberLong(doc._id);
            doc._id = tempId;
            db.users.save(doc);
        });

        db.datasets.find().forEach(function (doc, index) {
            print(doc.jsonData)
        });
            db.datasets.remove({ _id : doc._id});
            tempId = new NumberLong(doc._id);
            doc._id = tempId;
            db.datasets.save(doc);
        });
    },

    async down(db, client) {
    }
};
