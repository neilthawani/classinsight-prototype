const keys = require("../config/keys");

// Load Dataset model
const Dataset = require("../models/Dataset");

// Load input validation
const validateDatasetInput = require("../validation/data_upload");

module.exports = function(router, basePath, db) {
    // @route POST api/datasets/edit
    // @desc Edit or Delete dataset in Datasets table
    // @access Public
    router.post(`${basePath}/edit`, (req, res) => {
        const id = req.body.dataset._id;
        var byQuery = {
            _id: mongoose.Types.ObjectId(id)
        };

        let toUpdate = {
            'lastUpdatedDate': Date.now(),
            'isActive': req.body.dataset.isActive,
            'isDeleted': req.body.dataset.isDeleted
        };
        var options = {
            returnNewDocument: true,
            useFindAndModify: true,
            upsert: true,
            updateExisting: true
        };

        db.collection('datasets', function(error, collection) {
            collection.findOneAndUpdate(byQuery, { $set: toUpdate }, options).then(function(result, err) {
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
    });

    // @route GET api/datasets/list
    // @desc List all datasets
    // @access Public
    router.get(`${basePath}/list`, function(req, res) {
        var parsedDatasets = [];
        var datasetsToPopulate = [];

        db.collection('datasets', function(error, collection) {
            // console.log('collection', collection);
            // console.log('req', req);
            collection.find({userId: req.query.userId}).toArray(function(error, datasets) {
                // console.log('datasets', datasets);

                (datasets || []).forEach((dataset) => {
                    if (!dataset.isDeleted) {
                        var utterances = dataset.utterances ? dataset.utterances : [];
                        var newDataset = {
                            _id: dataset._id,
                            isActive: dataset.isActive,
                            isDeleted: dataset.isDeleted,
                            classTopic: dataset.classTopic,
                            lessonName: dataset.lessonName,
                            classDate: dataset.classDate,
                            classPeriod: dataset.classPeriod,
                            utterances: utterances
                        };

                        if (utterances.length === 0) {
                            datasetsToPopulate.push(newDataset);
                        } else {
                            parsedDatasets.push(newDataset);
                        }
                    }
                });

                console.log('parsedDatasets', parsedDatasets);
                console.log('datasetsToPopulate', datasetsToPopulate);

                datasetsToPopulate.forEach((dataset) => {
                    db.collection('utterances', function(error, collection) {
                        collection.find({datasetId: dataset._id}).toArray(function(error, utterances) {
                            parsedDatasets.push({
                                ...dataset,
                                utterances: utterances
                            });
                        });
                    });
                });

                console.log('list end', parsedDatasets);
                res.send(parsedDatasets);
            });
        });
    });

    // @route POST api/datasets/upload
    // @desc Upload dataset
    // @access Public
    router.post(`${basePath}/upload`, (req, res) => {
        // Form validation
        const {
            errors,
            isValid
        } = validateDatasetInput(req.body);

        // Check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        db.collection('datasets', function(error, collection) {
            // console.log('userId in', userId);
            // console.log('lessonName', req.body.lessonName);
            const newDataset = new Dataset({
                userId: req.body.userId,
                filename: req.body.filename,
                classTopic: req.body.classTopic,
                lessonName: req.body.lessonName,
                classDate: req.body.classDate,
                classPeriod: req.body.classPeriod,
                // utterances: []//req.body.utterances
            });

            collection.save(newDataset)
                .then((dataset) => {
                    // console.log('dataset', dataset);
                    db.collection('utterances', function(error, collection) {
                        req.body.utterances.forEach((utterance) => {
                            collection.save({
                              ...utterance,
                              datasetId: dataset._id
                            })
                            .then((row) => {
                                console.log('Utterance saved: ', row);
                            })
                            .catch((err) => {
                              return console.error(err);
                            })
                        })
                    });

                    return res.json(dataset.ops)
                })
                .catch((err) => {
                    return console.log(err)
                });
        });
    });
}
