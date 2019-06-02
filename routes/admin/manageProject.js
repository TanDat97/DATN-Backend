const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const checkAuthAdmin = require('../../middleware/checkAuthAdmin');
const libFunction = require('../../lib/function');
const Project = require('../../models/projectModel');
const Comment = require('../../models/commentModel');

const numItem = require('../../lib/constant')

router.get('/all/:page', checkAuthAdmin, (req, res, next) => {
    const page = parseInt(req.params.page) - 1
    Project.find().sort({'createTime': -1}).skip(page*numItem).limit(numItem)
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
        fullname: req.body.fullname,
        phone: req.body.phone,
        email: req.body.email,
        avatar: req.body.avatar,
        statusProject: req.body.statusProject,
        amount: req.body.type === 1 ? req.body.amount: 1,
        createTime: req.body.createTime,
        updateTime: req.body.updateTime,
        verify: false,
        allowComment: true,
        url: req.body.url,
        publicId: req.body.publicId,
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

router.post('/edit/:id', checkAuthAdmin, (req, res, next) => {
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
    const fullname = req.body.fullname;
    const phone = req.body.phone;
    const email = req.body.email;
    const avatar = req.body.avatar;
    const statusProject = req.body.statusProject;
    const createTime = req.body.createTime;
    const updateTime = req.body.updateTime;
    const url = req.body.url;
    const publicId = req.body.publicId;
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
            fullname: fullname,
            phone: phone,
            email: email,
            // avatar: avatar,
            statusProject: statusProject,
            amount: req.body.type === 1 ? req.body.amount: 1,
            updateTime: updateTime,
            // url: url,
            // publicId: publicId,
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
                    createTime: createTime,
                    updateTime: updateTime,
                    url: url,
                    publicId: publicId,
                },
                request: {
                    type: 'PATCH',
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

router.delete('/:id', checkAuthAdmin, (req, res, next) => {
    const projectid = req.params.id;
    Project.remove({
        _id: id
    })
    .exec()
    .then(result => {
        Comment.remove({projectid: projectid}).exec().then(result => console.log('delete comment success'))
        if (result.n > 0) {
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

router.post('/changeAllowComment/:id', checkAuthAdmin, (req, res, next) => {
    Project.update({
        _id: req.params.id,
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

router.post('/changeVerify/:id', checkAuthAdmin, (req, res, next) => {
    Project.update({
        _id: req.params.id,
    }, {
        $set: {
            verify: req.body.verify,
        }
    })
    .exec()
    .then(result => {
        if (result.nModified > 0) {
            res.status(200).json({
                status: 200,
                message: 'change verify success',
                verify: req.body.verify,
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

router.get('/allcomment/:id', checkAuthAdmin, (req, res, next) => {
    const projectid = req.params.id
    Comment.find({
        projectid: projectid,
    })
    .populate({path:'user'})
    .sort({'createTime': -1})
    .select()
    .exec()
    .then(results => {
        if (results.length > 0) {
            const temp = results.map(element=>{
                return {
                    _id: element._id,
                    user: {
                        id: element.user._id,
                        email: element.user.email,
                        fullname: element.user.fullname,
                        avatar: element.user.avatar,
                    },
                    updateTime: element.updateTime,
                    createTime: element.createTime,
                    projectid: element.projectid,
                    content: element.content,
                    star: element.star,
                }
            })
            res.status(200).json({
                status: 200,
                count: temp.length,
                comments: temp,
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
