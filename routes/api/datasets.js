const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const passport = require("passport");

// Load Dataset model
const Dataset = require("../../models/Dataset");

// Load input validation
const validateDatasetInput = require("../../validation/data_upload");

// @route POST api/datasets/edit
// @desc Edit or Delete dataset in Datasets table
// @access Public
router.post('/edit', (req, res) => {
    const id = req.body.dataset._id;
    var byQuery = {
        _id: id
    };

    let toUpdate = {
        'lastUpdatedDate': Date.now(),
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
    Dataset.find({userId: req.query.userId}, function(error, datasets) {
        var parsedDatasets = [];

        (datasets || []).forEach((dataset) => {
            if (!dataset.isDeleted) {
                parsedDatasets.push({
                    _id: dataset._id,
                    isActive: dataset.isActive,
                    isDeleted: dataset.isDeleted,
                    classTopic: dataset.classTopic,
                    classDate: dataset.classDate,
                    classPeriod: dataset.classPeriod,
                    utterances: dataset.utterances
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
        // if multiple class periods, parse as multi-entry array
        // otherwise, parse as single-entry array
        // var classPeriod = req.body.classPeriod.includes(",") ?
        //     req.body.classPeriod.split(",").map((period) => parseInt(period.trim(), 10)) : [parseInt(req.body.classPeriod, 10)];
        // debugger;

        const newDataset = new Dataset({
            userId: req.body.userId,
            filename: req.body.filename,
            classTopic: req.body.classTopic,
            classDate: req.body.classDate,
            classPeriod: req.body.classPeriod,
            utterances: req.body.utterances
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
