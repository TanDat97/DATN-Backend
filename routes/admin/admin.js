const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const checkAuthAdmin = require('../../middleware/checkAuthAdmin');
const Admin = require('../../models/adminModel');
const User = require('../../models/userModel');
const Project = require('../../models/projectModel');
const News = require('../../models/newsModel');

router.post('/signup', checkAuthAdmin, (req, res, next) => {
    Admin.find({
        email: req.body.email,
    })
    .exec()
    .then(admin => {
        if (admin.length >= 1) {
            return res.status(409).json({
                status: 409,
                message: 'admin exists',
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        status: 500,
                        error: err,
                    });
                } else {
                    const admin = Admin({
                        _id: new mongoose.Types.ObjectId(),
                        password: hash,
                        fullname: req.body.fullname,
                        address: req.body.address,
                        email: req.body.email,
                        phone: req.body.phone,
                    });
                    admin
                    .save()
                    .then(result => {
                        res.status(201).json({
                            status: 201,
                            message: 'admin created',
                            email: result.email,
                            // id: result._id,
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            status: 500,
                            error: err
                        });
                    });
                }
            });
        }
    })
    .catch();
});

router.post('/login', (req, res, next) => {
    Admin.find({
        email: req.body.email
    })
    .exec()
    .then(admin => {
        if (admin.length <= 0) {
            return res.status(401).json({
                status: 401,
                message: 'Auth failed email,'
            });
        }
        bcrypt.compare(req.body.password, admin[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    status: 401,
                    message: 'Auth failed password'
                });
            }
            if (result) {
                const token = jwt.sign({
                    id: admin[0]._id,
                    email: admin[0].email,
                    adminname: admin[0].adminname,
                    fullname: admin[0].fullname,
                    address: admin[0].address,
                    status: 'adminaccount',
                }, 'HS256', {
                    expiresIn: "2h"
                });
                return res.status(200).json({
                    status: 200,
                    message: 'successful',
                    id: admin[0]._id,
                    email: admin[0].email,
                    adminname: admin[0].adminname,
                    fullname: admin[0].fullname,
                    address: admin[0].address,
                    phone: admin[0].phone,
                    avatar: admin[0].avatar,
                    token: token,
                })
            }
            return res.status(401).json({
                status: 401,
                message: 'Auth failed'
            });
        });
    })
    .catch(err => {
        console.log(err);
        return res.status(401).json({
            status: 401,
            message: 'Auth failed',
            error: err
        });
    });
});

router.get('/:id', checkAuthAdmin, (req, res, next) => {
    const id = req.params.id;
    Admin.findById(id)
    .exec()
    .then(result => {
        if (result !== null) {
            res.status(200).json({
                status: 200,
                admin: result,
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

router.patch('/', checkAuthAdmin, (req, res, next) => {
    const id = req.userData.id;
    const fullname = req.body.fullname;
    const address = req.body.address;
    const email = req.body.email;
    const phone = req.body.phone;
    const createBy = req.body.createBy;

    Admin.update({
        _id: id,
        email:email,
    }, {
        $set: {
            fullname: fullname,
            address: address,
            phone: phone,
        }
    })
    .exec()
    .then(result => {
        if (result.nModified > 0) {
            res.status(200).json({
                status: 200,
                message: 'update admin success',
                admin: {
                    id: id,
                    fullname: fullname,
                    address: address,
                    email: email,
                    phone: phone,
                    createBy: createBy,
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

router.post('/changepassword', checkAuthAdmin, (req, res, next) => {
    Admin.find({
        email: req.userData.email,
        _id: req.userData.id,
    })
    .exec()
    .then(admin => {
        if (admin.length <= 0) {
            return res.status(401).json({
                status: 401,
                message: 'Account not found'
            });
        }
        bcrypt.compare(req.body.currentPassword, admin[0].password, (err, result) => {
            if (err) {
                return res.status(40).json({
                    status: 401,
                    message: 'Change password failed 1',
                });
            }
            if (result) {
                bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            status: 500,
                            error: err,
                        });
                    } else {
                        Admin.update({
                            email: req.userData.email,
                            _id: req.userData.id,
                        }, {
                            $set: {
                                password: hash
                            }
                        })
                        .exec()
                        .then(result => {
                            if (result.nModified > 0) {
                                res.status(200).json({
                                    status: 200,
                                    message: 'Change password success',
                                    email: req.userData.email,
                                    _id: req.userData.id,
                                });
                            } else {
                                res.status(404).json({
                                    status: 404,
                                    message: 'Change password failed 2'
                                })
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                status: 500,
                                error: err,
                                message: 'Change password failed 3',
                            });
                        });     
                    }
                }) 
            } else {
                return res.status(401).json({
                    status: 401,
                    message: 'Change password failed 4',
                });
            }
        });
    })
    .catch(err => {
        console.log(err);
        return res.status(401).json({
            status: 401,
            error: err,
            message: 'Change password failed 5',
        });
    });
});

router.post('/changeavatar', checkAuthAdmin, (req, res, next) => {
    const id = req.userData.id;
    const avatar = req.body.avatar;

    Admin.update({
        _id: id,
    }, {
        $set: {
            avatar: avatar,
        }
    })
    .exec()
    .then(result => {
        if (result.nModified > 0) {
            res.status(200).json({
                status: 200,
                message: 'change avatar admin success',
                admin: {
                    id: id,
                    avatar: avatar
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
})

function countAccount(){
    return new Promise((resolve,reject) => {
        User.count({}, (err, count) => {
            if(err)
                reject(err)
            resolve(count)
        })
    })
}
function countProject(){
    return new Promise((resolve,reject) => {
        Project.count({}, (err, count) => {
            if(err)
                reject(err)
            resolve(count)
        })
    })
}
function countNews(){
    return new Promise((resolve,reject) => {
        News.count({}, (err, count) => {
            if(err)
                reject(err)
            resolve(count)
        })
    })
}

router.post('/statisticdata', checkAuthAdmin, (req, res, next) => {
    Promise.all([countAccount(),countProject(),countNews()])
    .then(function(arrayOfResults) {
        const [account, project, news] = arrayOfResults
        res.status(200).json({
            status: 200,
            message: 'get data success',
            countAccount: account,
            countProject: project,
            countNews: news,
        });
    })
    .catch(err => {
        res.status(500).json({
            status: 500,
            error: err
        });
    })
})

module.exports = router;