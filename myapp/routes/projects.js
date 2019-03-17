const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const checkAuth = require('../middleware/check-auth');
const libFunction = require('../lib/function');
const Project = require('../models/projectModel');

router.get('/', (req, res, next) => {
    Project.find()
    .select()
    .exec()
    .then(results => {
        if (results.length >= 0) {
            res.status(200).json({
                status: 200,
                count: results.length,
                projects: results,
            });
        } else {
            res.status(404).json({
                status: 404,
                message: 'No valid entry found',
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            status: 500,
            error: err
        });
    });
});

router.post('/getListInRadius', (req, res, next) => {
    Project.find()
    .select()
    .exec()
    .then(temp => {
        const results = libFunction.distanceListPlace(temp, req.body.radius, req.body.lat, req.body.long)
        if (results.length >= 0) {
            res.status(200).json({
                status: 200,
                count: results.length,
                projects: results,
            });
        } else {
            res.status(404).json({
                status: 404,
                message: 'No valid entry found',
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            status: 500,
            error: err
        });
    });
});

router.get('/:id', checkAuth, (req, res, next) => {
    const id = req.params.id;
    Project.findById(id)
    .exec()
    .then(result => {
        res.status(200).json({
            status: 200,
            result,
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            status: 500,
            error: err
        });
    });
});

router.post('/', checkAuth, (req, res, next) => {
    const project= new Project({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        investor: req.body.investor,
        price: req.body.price,
        unit: req.body.unit,
        area: req.body.area,
        address: req.body.address,
        type: req.body.type,
        info: req.body.info,
        lat: req.body.lat,
        long: req.body.long,
        ownerid: req.body.ownerid,
        statusProject: req.body.statusProject,
    });
    project
        .save()
        .then(result => {
            res.status(201).json({
                status: 201,
                message: 'add project success',
                createdProject: {
                    result,
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3001/projects/' + result._id,
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: 500,
                error: err,
            });
        });

});

router.patch('/:id', checkAuth, (req, res, next) => {
    const id = req.params.id;
    const name = req.body.name;
    const investor = req.body.investor;
    const price = req.body.price;
    const unit = req.body.unit;
    const area = req.body.area;
    const address = req.body.address;
    const type = req.body.type;
    const info = req.body.info;
    const lat = req.body.lat;
    const long = req.body.long;
    const ownerid = req.body.ownerid;
    const  statusProject = req.body.statusProject;
    Project.update({
        _id: id
    }, {
            $set: {
                name: name,
                investor: investor,
                price: price,
                unit: unit,
                area: area,
                address: address,
                type: type,
                info: info,
                lat: lat,
                long: long,
                ownerid: ownerid,
                statusProject: statusProject,
            }
        })
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    status: 200,
                    message: 'update project success',
                    project: {
                        _id: id,
                        name: name,
                        investor: investor,
                        price: price,
                        unit: unit,
                        area: area,
                        address: address,
                        type: type,
                        info: info,
                        lat: lat,
                        long: long,
                        ownerid: ownerid,
                        statusProject: statusProject,
                    },
                    request: {
                        type: 'PATCH',
                        url: 'http://localhost:3001/projects/' + id,
                    }
                });
            } else {
                res.status(404).json({
                    status: 404,
                    message: 'No valid entry found'
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: 500,
                error: err
            });
        });
});

router.delete('/:id', checkAuth, (req, res, next) => {
    const id = req.params.id;
    Project.remove({
        _id: id
    })
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    status: 200,
                    message: 'delete project success',
                    request: {
                        type: 'DELETE',
                        url: 'http://localhost:3001/projects/',
                    }
                });
            } else {
                res.status(404).json({
                    status: 200,
                    message: 'No valid entry found'
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: 500,
                error: err
            });
        });
});

router.get('search/:type/:address/:area/:price', (req, res, next) => {
    Project.find()
    .select()
    .exec()
    .then(results => {
        if (results.length >= 0) {
            res.status(200).json({
                status: 200,
                count: results.length,
                projects: results,
            });
        } else {
            res.status(404).json({
                status: 404,
                message: 'No valid entry found',
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            status: 500,
            error: err
        });
    });
});

module.exports = router;
