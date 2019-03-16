const express = require('express');
const router = express.Router();
const Project = require('../models/projectModel');
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const libFunction = require('../lib/function');

router.get('/', (req, res, next) => {
    Project.find()
    .select('_id id name investor price unit area address type info lat long')
    .exec()
    .then(results => {
        console.log(results);
        const response = {
            count: results.length,
            projects: results.map(result => {
                return {
                    _id: result._id,
                    name: result.name,
                    investor: result.investor,
                    price: result.price,
                    unit: result.unit,
                    area: result.area,
                    address: result.address,
                    type: result.type,
                    info: result.info,
                    lat: result.lat,
                    long: result.long,
                }
            })
        };
        if (results.length >= 0) {
            res.status(200).json({
                status: 200,
                response,
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
    .select('_id id name investor price unit area address type info lat long')
    .exec()
    .then(temp => {
        const results = libFunction.distanceListPlace(temp, req.body.radius, req.body.lat, req.body.long)
        const response = {
            count: results.length,
            projects: results.map(result => {
                return {
                    _id: result._id,
                    name: result.name,
                    investor: result.investor,
                    price: result.price,
                    unit: result.unit,
                    area: result.area,
                    address: result.address,
                    type: result.type,
                    info: result.info,
                    lat: result.lat,
                    long: result.long,
                }
            })
        };
        if (results.length >= 0) {
            res.status(200).json({
                status: 200,
                response,
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
    .then(doc => {
        console.log(doc);
        res.status(200).json({
            status: 200,
            doc,
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

router.post('/', (req, res, next) => {
    const project= new Project({
        _id: new mongoose.Types.ObjectId(),
        id: "project",
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
    });
    project
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                status: 201,
                message: 'add project success',
                createdProject: {
                    name: result.name,
                    investor: result.investor,
                    price: result.price,
                    unit: result.unit,
                    area: result.area,
                    address: result.address,
                    type: result.type,
                    info: result.info,
                    lat: result.lat,
                    long: result.long,
                    _id: result._id,
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

router.patch('/:id', (req, res, next) => {
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
            }
        })
        .exec()
        .then(result => {
            console.log(result);
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

router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Project.remove({
        _id: id
    })
        .exec()
        .then(result => {
            console.log(result);
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

module.exports = router;
