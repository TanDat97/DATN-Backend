const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const checkAuthAdmin = require('../../middleware/checkAuthAdmin');
const Admin = require('../../models/adminModel');

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
            if (admin.length < 0) {
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
                        expiresIn: "1h"
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

module.exports = router;
