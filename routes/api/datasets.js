// show edit list delete upload

const express = require("express");
const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load Dataset model
const Dataset = require("../../models/Dataset");

// Load input validation
const validateDatasetInput = require("../../validation/data_upload");

// @route GET api/datasets/show
// @desc Retrieve user from Datasets table
// @access Public
router.get('/show', (req, res) => {
    // console.log("req", req, "res", res);
    // console.log("res res", res);
    // console.log("req.body body", req.body);
    const id = req.query._id;
    // console.log("getgetget id", id);
    Dataset.find({ _id: id }).then(dataset => {
        // console.log("then user", user);
        if (user) {
            return res.status(200).json({ message: "Dataset found", dataset: dataset && dataset[0] });
        } else {
            return res.status(400).json({ nouser: `There is no dataset with id: ${id}` });
        }
    });
});

// @route POST api/datasets/edit
// @desc Edit or Delete dataset in Datasets table
// @access Public
router.post('/edit', (req, res) => {
    const id = req.body.dataset._id;

    var byQuery = { _id: id };
    let toUpdate = {
      'last_updated_date': Date.now(),
      'isActive': req.body.dataset.isActive,
      'isDeleted': req.body.dataset.isDeleted
    };
    var options = { returnNewDocument: true, useFindAndModify: false };

    User.findOneAndUpdate(byQuery, {$set: toUpdate}, options, function(err, result) {
        if (err) {
            return res.status(400).json({ message: 'Unable to update dataset.' });
        } else {
            return res.status(200).json({ message: 'Dataset updated successfully. Refreshing data...', dataset: result });
        }
    });
});

// @route GET api/datasets/list
// @desc List all datasets
// @access Public
router.get('/list', function(req, res) {
    Dataset.find({}, function(error, datasets) {
        var parsedDatasets = datasets.map((dataset) => {
            if (dataset.isActive && !dataset.isDeleted) {
                return {
                    _id: dataset._id,
                    class_topic: dataset.class_topic,
                    class_date: dataset.class_date,
                    class_period: dataset.class_period,
                    jsonData: dataset.jsonData
                }
            }
        })
        res.send(parsedDatasets);
    });
});

// @route POST api/datasets/upload
// @desc Upload dataset
// @access Public
router.post("/upload", (req, res) => {
  // console.log("req.body", req.body.jsonData.segments);
  // Form validation
  const { errors, isValid } = validateDatasetInput(req.body);

  // console.log("errors", errors);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Dataset.findOne({ _id: req.body._id }).then(dataset => {
      const newDataset = new Dataset({
        user_id: req.body.user_id,
        filename: req.body.filename,
        class_topic: req.body.class_topic,
        class_date: req.body.class_date,
        class_period: req.body.class_period,
        jsonData: req.body.jsonData
      });

      // console.log("jsonData", typeof req.body.jsonData);
      // debugger;
      // Hash password before saving in database
      newDataset
        .save()
        .then(dataset => res.json(dataset))
        .catch(err => console.log(err));
  });
});

module.exports = router;
