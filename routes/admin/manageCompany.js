const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const checkAuthAdmin = require('../../middleware/checkAuthAdmin');
const libFunction = require('../../lib/function');
const Company = require('../../models/companyModel');
const User = require('../../models/userModel');
const Project = require('../../models/projectModel');
const Comment = require('../../models/commentModel');

const numItem = 30

router.get('/all/:page', checkAuthAdmin, (req, res, next) => {
    const page = parseInt(req.params.page) - 1
    Company.find().skip(page).limit(numItem)
    .select()
    .exec()
    .then(results => {
        if (results.length > 0) {
            res.status(200).json({
                status: 200,
                count: results.length,
                page: page + 1,
                company: results,
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
    Company.findById(id)
    .exec()
    .then(result => {
        if (result !== null) {
            res.status(200).json({
                status: 200,
                company: result,
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
    Company.find({
        email: req.body.email,
    })
    .exec()
    .then(result => {
        if (result.length >= 1) {
            return res.status(409).json({
                status: 409,
                message: 'company exists',
            });
        } else {
            const pass = libFunction.randomPassword(6)
            bcrypt.hash(pass, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        status: 500,
                        error: err,
                    });
                } else {
                    console.log(pass)
                    var company= new Company({
                        _id: new mongoose.Types.ObjectId(),
                        password: hash,
                        companyname: req.body.companyname,
                        address: req.body.address,
                        email: req.body.email,
                        phone: req.body.phone,
                        totalProject: 0,
                        totalEmployees: [],
                        status: 0,
                        avatar: req.body.avatar,
                        description: req.body.description,
                        verify: false,
                        hash: 0,
                    });
                    company.hash = libFunction.hashString(company._id.toString())
                    company
                    .save()
                    .then(result => {
                        res.status(201).json({
                            status: 201,
                            message: 'add company success',
                            company: result,
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            status: 500,
                            error: err,
                        });
                    });
                    // var link = "http://localhost:3000/verifycompany/" + company._id + "/" + company.hash;
                    // var EmailCompanyModel = require('../../lib/emailCompanyModel');
                    // var emailModel = new EmailCompanyModel();
                    // emailModel.verifyMail(admin.email, link);
                    // transporter.sendMail(emailModel.mail, function (err, info) {
                    //     if (err) {
                    //         console.log('signup error, please try again ' + err);
                    //         res.status(500).json({
                    //             status: 500,
                    //             message: 'signup error, please try again',
                    //             error: err,
                    //         });
                    //     } else {
                    //         company
                    //         .save()
                    //         .then(result => {
                    //             res.status(201).json({
                    //                 status: 201,
                    //                 message: 'company created, check email to verify account',
                    //                 email: company.email,
                    //                 info: info.response,
                    //             })
                    //         })
                    //         .catch(err => {
                    //             console.log(err);
                    //             res.status(500).json({
                    //                 status: 500,
                    //                 error: err
                    //             });
                    //         });
                    //     }
                    // })                 
                }
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

router.post('/edit/:id', checkAuthAdmin, (req, res, next) => {
    const id = req.params.id;
    const companyname = req.body.companyname;
    const address = req.body.address;
    const email = req.body.email;
    const phone = req.body.phone;
    const totalProject = req.body.totalProject;
    const totalEmployees = req.body.totalEmployees;
    const status = req.body.status;
    const description = req.body.description;
    Company.update({
        _id: id,
        email: email,
    }, {
        $set: {
            companyname: companyname,
            address: address,
            phone: phone,
            totalProject: totalProject,
            status: status,
            description: description,
        }
    })
    .exec()
    .then(result => {
        if (result.nModified > 0) {
            res.status(200).json({
                status: 200,
                message: 'update company success',
                company: {
                    _id: id,
                    companyname: companyname,
                    address: address,
                    phone: phone,
                    totalProject: totalProject,
                    status: status,
                    description: description,
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
    Company.remove({
        _id: req.params.id
    })
    .exec()
    .then(result => {
        // Project.remove({ownerid: req.params.id}).exec().then(result => console.log('delete project success'))
        if(result.n > 0) {
            res.status(200).json({
                status: 200,
                message: 'company deleted',
                result: result
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

module.exports = router;