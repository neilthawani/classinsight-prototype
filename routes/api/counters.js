// // @route POST api/users/edit
// // @desc Edit user in Users table
// // @access Public
// router.post('/edit', (req, res) => {
//     const {
//         errors,
//         isValid
//     } = validateEditUser(req.body.user);
//
//     if (!isValid) {
//         return res.status(400).json(errors);
//     }
//
//     const _id = req.body.user._id;
//     var byQuery = {
//         _id: _id
//     };
//     let toUpdate = {
//         'name': req.body.user.name,
//         'email': req.body.user.email,
//         'userType': req.body.user.userType
//     };
//     var options = {
//         returnNewDocument: true,
//         useFindAndModify: false
//     };
//
//     User.findOneAndUpdate(byQuery, {
//         $set: toUpdate
//     }, options, function(err, result) {
//         if (err) {
//             return res.status(400).json({
//                 message: 'Unable to update user.'
//             });
//         } else {
//             return res.status(200).json({
//                 message: 'User updated successfully. Refreshing data...',
//                 user: result
//             });
//         }
//     });
// });
//
// const Counter = require("../../models/Counter");
//
// module.exports = function getNextIdInSequence(dbName) {
//     // var ret = Counter.findOneAndUpdate({
//     //     query: { dbName: dbName },
//     //     $set: { $inc: { count: 1 } },
//     //     new: true,
//     //     upsert: true
//     // });
//     Counter.find({
//         dbName: dbName
//     }).then(row => {
//         if (row) {
//             console.log("row", row);
//             return row;//[0].count + 1;
//         } else {
//             return {error: "Error"};
//         }
//     });
//
//     // var result =
//     // Counter.findOneAndUpdate(
//     //     {dbName: dbName},
//     //     {$inc: {count: 1}},
//     //     {new: true, upsert: true, useFindAndModify: false},
//     //     function(err, result) {
//     //     if (err) {
//     //         console.log('Error...', err);
//     //     } else {
//     //         console.log('Success:', result);
//     //         // debugger;
//     //         // return result.toArray()
//     //         // console.log("result", JSON.parse(JSON.stringify(result)));
//     //         // return JSON.parse(JSON.stringify(result));
//     //         //json(count;
//     //     }
//     // });
//
//     // return result.count;
// }
