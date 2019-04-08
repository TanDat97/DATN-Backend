const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const checkAuthAdmin = require('../../middleware/checkAuthAdmin');
const libFunction = require('../../lib/function');
const Project = require('../../models/projectModel');

const numItem = 30

router.get('/all/:page', checkAuthAdmin, (req, res, next) => {
    const page = parseInt(req.params.page) - 1
    Project.find().sort({'createTime': -1}).skip(page).limit(numItem)
    .select()
    .exec()
    .then(results => {
        if (results.length > 0) {
            res.status(200).json({
                status: 200,
                count: results.length,
                page: page + 1,
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

router.get('/:id', checkAuthAdmin, (req, res, next) => {
    const id = req.params.id;
    Project.findById(id)
    .exec()
    .then(result => {
        res.status(200).json({
            status: 200,
            project: result,
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

router.post('/', checkAuthAdmin, (req, res, next) => {
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
        createTime: req.body.createTime,
        updateTime: req.body.updateTime,
    });
    // console.log(project)
    project
        .save()
        .then(result => {
            res.status(201).json({
                status: 201,
                message: 'add project success',
                project: result,
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

router.patch('/:id', checkAuthAdmin, (req, res, next) => {
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
    const statusProject = req.body.statusProject;
    const createTime = req.body.createTime;
    const updateTime = req.body.updateTime;
    Project.update({
        _id: id,
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
            createTime: createTime,
            updateTime: updateTime,
        }
    })
    .exec()
    .then(result => {
        if (result.nModified > 0) {
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
                    createTime: createTime,
                    updateTime: updateTime,
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

router.get('/changeAllowComment/:id', checkAuthAdmin, (req, res, next) => {
    Project.update({
        _id: id,
    }, {
        $set: {
            allowComment: req.body.allowComment,
        }
    })
    .exec()
    .then(result => {
        if (result.nModified > 0) {
            res.status(200).json({
                status: 200,
                message: 'change allow comment success',
                allowComment: req.body.allowComment,
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
})

router.delete('/:id', checkAuthAdmin, (req, res, next) => {
    const id = req.params.id;
    Project.remove({
        _id: id
    })
        .exec()
        .then(result => {
            if (result.n > 0) {
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
                });
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
