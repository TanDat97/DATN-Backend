const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const checkAuth = require('../middleware/checkAuth');
const libFunction = require('../lib/function');
const Project = require('../models/projectModel');
const Comment = require('../models/commentModel');

const numItem = 30;

router.get('/all/:page', (req, res, next) => {
    const page = req.params.page - 1
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

router.post('/home', (req, res, next) => {
    Project.find()
    .select()
    .exec()
    .then(temp => {
        const results = libFunction.distanceListPlace(temp, req.body.radius, req.body.lat, req.body.long)
        if (results.length > 0) {
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

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    Project.findById(id)
    .exec()
    .then(result => {
        if(result!=null){
            res.status(200).json({
                status: 200,
                project: result,
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
        ownerid: req.userData.id,
        fullname: req.body.fullname,
        phone: req.body.phone,
        email: req.body.email,
        avatar: req.body.avatar,
        statusProject: req.body.statusProject,
        createTime: req.body.createTime,
        updateTime: req.body.updateTime,
        allowComment: true,
        url: req.body.url,
        publicId: req.body.publicId
    });
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

router.post('/edit/:id', checkAuth, (req, res, next) => {
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
    const ownerid = req.userData.id;
    const fullname = req.body.fullname;
    const phone = req.body.phone;
    const email = req.body.email;
    const avatar = req.body.avatar;
    const statusProject = req.body.statusProject;
    const updateTime = req.body.updateTime;
    Project.update({
        _id: id,
        ownerid: req.userData.id
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
            fullname: fullname,
            phone: phone,
            email: email,
            avatar: avatar,
            statusProject: statusProject,
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
                    fullname: fullname,
                    phone: phone,
                    email: email,
                    avatar: avatar,
                    statusProject: statusProject,
                    updateTime: updateTime,
                },
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
    const projectid = req.params.id;
    Project.remove({
        _id: projectid,
        ownerid: req.userData.id,
    })
    .exec()
    .then(result => {
        if (result.n > 0) {
            Comment.remove({projectid: projectid}).exec().then(result => console.log('delete comment success'))
            res.status(200).json({
                status: 200,
                message: 'delete project success',
                request: {
                    type: 'DELETE',
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

router.post('/searchstatus', (req, res, next) => {
    const statusParam = req.body.status
    const addressParam =  req.body.address
    const areaParam = libFunction.convertData(req.body.area);
    const priceParam = libFunction.convertData(req.body.price);
    Project.find({
        statusProject: statusParam,
        area: {$gte: areaParam.start, $lte: areaParam.end},
        price: {$gte: priceParam.start, $lte: priceParam.end},
        address: {$regex:`.*${addressParam}.*`},
    })
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

router.post('/searchtype', (req, res, next) => {
    const typeParam = req.body.type
    const statusParam = req.body.status
    const addressParam =  req.body.address
    const areaParam = libFunction.convertData(req.body.area);
    const priceParam = libFunction.convertData(req.body.price);
    Project.find({
        type: typeParam,
        statusProject: statusParam,
        area: {$gte: areaParam.start, $lte: areaParam.end},
        price: {$gte: priceParam.start, $lte: priceParam.end},
        address: {$regex:`.*${addressParam}.*`},
    })
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

router.post('/searchaddress', (req, res, next) => {
    const addressParam = req.body.address
    const areaParam = libFunction.convertData(req.body.area);
    const priceParam = libFunction.convertData(req.body.price);
    Project.find({
        area: {$gte: areaParam.start, $lte: areaParam.end},
        price: {$gte: priceParam.start, $lte: priceParam.end},
        address: {$regex:`.*${addressParam}.*`},
    })
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
