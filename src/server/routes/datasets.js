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
        db.collection('datasets', function(error, collection) {
            // console.log('collection', collection);
            // console.log('req', req);
            collection.find({userId: req.query.userId}).toArray(function(error, datasets) {
                var parsedDatasets = [];
                // console.log('datasets', datasets);

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

                // console.log('parsedDatasets', parsedDatasets);
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
            const newDataset = new Dataset({
                userId: req.body.userId,
                filename: req.body.filename,
                classTopic: req.body.classTopic,
                classDate: req.body.classDate,
                classPeriod: req.body.classPeriod,
                utterances: req.body.utterances
            });

            collection.save(newDataset)
                .then((dataset) => {
                    // console.log('dataset', dataset);
                    return res.json(dataset.ops)
                })
                .catch((err) => {
                    return console.log(err)
                });
        });
    });
}
