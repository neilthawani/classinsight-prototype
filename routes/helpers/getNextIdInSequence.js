const Counter = require("../../models/Counter");

module.exports = function getNextIdInSequence(dbName) {
    // var ret = Counter.findOneAndUpdate({
    //     query: { dbName: dbName },
    //     $set: { $inc: { count: 1 } },
    //     new: true,
    //     upsert: true
    // });
    Counter.find({
        dbName: dbName
    }).then(row => {
        if (row) {
            console.log("row", row);
            return row;//[0].count + 1;
        } else {
            return {error: "Error"};
        }
    });

    // var result =
    // Counter.findOneAndUpdate(
    //     {dbName: dbName},
    //     {$inc: {count: 1}},
    //     {new: true, upsert: true, useFindAndModify: false},
    //     function(err, result) {
    //     if (err) {
    //         console.log('Error...', err);
    //     } else {
    //         console.log('Success:', result);
    //         // debugger;
    //         // return result.toArray()
    //         // console.log("result", JSON.parse(JSON.stringify(result)));
    //         // return JSON.parse(JSON.stringify(result));
    //         //json(count;
    //     }
    // });

    // return result.count;
}
