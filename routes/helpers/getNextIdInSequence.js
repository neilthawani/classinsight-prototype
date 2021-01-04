const Counter = require("../../models/Counter");

var getNextIdInSequence = function(dbName) {
    var ret = Counter.findAndModify({
        query: { dbName: dbName },
        update: { $inc: { count: 1 } },
        new: true,
        upsert: true
    });

    return ret.count;
}

export default getNextIdInSequence;
