const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const passport = require("passport");

// Load Dataset model
const Dataset = require("../../models/Dataset");

// Load input validation
const validateDatasetInput = require("../../validation/data_upload");

// @route GET api/datasets/show
// @desc Retrieve user from Datasets table
// @access Public
// router.get('/show', (req, res) => {
//     const id = req.query._id;
//     Dataset.find({
//         _id: id
//     }).then(dataset => {
//         if (user) {
//             return res.status(200).json({
//                 message: "Dataset found",
//                 dataset: dataset && dataset[0]
//             });
//         } else {
//             return res.status(400).json({
//                 nouser: `There is no dataset with id: ${id}`
//             });
//         }
//     });
// });

// @route POST api/datasets/edit
// @desc Edit or Delete dataset in Datasets table
// @access Public
router.post('/edit', (req, res) => {
    const id = req.body.dataset._id;
    var byQuery = {
        _id: id
    };

    let toUpdate = {
        'last_updated_date': Date.now(),
        'isActive': req.body.dataset.isActive,
        'isDeleted': req.body.dataset.isDeleted
    };
    var options = {
        returnNewDocument: true,
        useFindAndModify: true
    };

    Dataset.findOneAndUpdate(byQuery, {
        $set: toUpdate
    }, options, function(err, result) {
        if (err) {
            return res.status(400).json({
                message: 'Unable to update dataset.'
            });
        } else {
            return res.status(200).json({
                message: 'Dataset updated successfully. Refreshing data...',
                dataset: result
            });
        }
    });
});

// @route GET api/datasets/list
// @desc List all datasets
// @access Public
router.get('/list', function(req, res) {
    Dataset.find({}, function(error, datasets) {
        // console.log("datasets", datasets);
        var parsedDatasets = [];

        datasets.forEach((dataset) => {
            if (!dataset.isDeleted && dataset.user_id.toString() === req.query.user_id) {
                parsedDatasets.push({
                    _id: dataset._id,
                    isActive: dataset.isActive,
                    isDeleted: dataset.isDeleted,
                    class_topic: dataset.class_topic,
                    class_date: dataset.class_date,
                    class_period: dataset.class_period,
                    jsonData: dataset.jsonData
                });
            }
        });

        res.send(parsedDatasets);
    });
});

// @route POST api/datasets/upload
// @desc Upload dataset
// @access Public
router.post("/upload", (req, res) => {
    // Form validation
    const {
        errors,
        isValid
    } = validateDatasetInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    Dataset.findOne({
        _id: req.body._id
    }).then(dataset => {
        const newDataset = new Dataset({
            user_id: req.body.user_id,
            filename: req.body.filename,
            class_topic: req.body.class_topic,
            class_date: req.body.class_date,
            class_period: req.body.class_period,
            jsonData: JSON.stringify(req.body.jsonData)
        });

        // Hash password before saving in database
        newDataset
            .save()
            .then((dataset) => {
                return res.json(dataset)
            })
            .catch((err) => {
                return console.log(err)
            });
    });
});

module.exports = router;
