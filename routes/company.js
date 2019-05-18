const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const checkAuthCompany = require('../middleware/checkAuthCompany');
const libFunction = require('../lib/function');
const Company = require('../models/companyModel');
const User = require('../models/userModel');
const Project = require('../models/projectModel');
const SavedProject = require('../models/savedProjectModel');

router.post('/login', (req, res, next) => {
    Company.find({
        email: req.body.email
    })
        .exec()
        .then(company => {
            if (company.length < 0) {
                return res.status(401).json({
                    status: 401,
                    message: 'Auth failed email,'
                });
            }
            bcrypt.compare(req.body.password, company[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        status: 401,
                        message: 'Auth failed password'
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        id: company[0]._id,
                        email: company[0].email,
                        companyname: company[0].companyname,
                        address: company[0].address,
                        phone: company[0].phone,
                        totalProject: company[0].totalProject,
                        employess: company[0].employess,
                        status: company[0].status,
                    }, 'shhhhh', {
                            expiresIn: "5h"
                        });
                    return res.status(200).json({
                        status: 200,
                        message: 'successful',
                        id: company[0]._id,
                        email: company[0].email,
                        fullname: company[0].fullname,
                        address: company[0].address,
                        description: company[0].description,
                        totalProject: company[0].totalProject,
                        employess: company[0].employess,
                        status: company[0].status,
                        verify: company[0].verify,
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

router.get('/info', checkAuthCompany, (req, res, next) => {
    const id = req.companyData.id;
    Company.findById(id)
        .populate({path:'employees.employee'})
        .exec()
        .then(result => {
            res.status(200).json({
                status: 200,
                message: 'successful',
                id: result._id,
                email: result.email,
                fullname: result.fullname,
                address: result.address,
                phone: result.phone,
                totalProject: result.totalProject,
                employees: result.employees,
                status: result.status,
                avatar: result.avatar,
                description: result.description,
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

router.post('/edit', checkAuthCompany, (req, res, next) => {
    const id = req.companyData.id;
    const email = req.companyData.email;
    const fullname = req.body.fullname;
    const address = req.body.address;
    const phone = req.body.phone;
    const totalProject = req.body.totalProject;
    const status = req.body.status;
    const avatar = req.body.avatar;
    const description = req.body.description;

    Company.updateMany({
        _id: id,
        email: email
    }, {
            $set: {
                fullname: fullname,
                address: address,
                phone: phone,
                totalProject: totalProject,
                status: status,
                avatar: avatar,
                description: description,
            }
        })
        .exec()
        .then(result => {
            if (result.nModified > 0) {
                res.status(200).json({
                    status: 200,
                    message: 'update user success',
                    user: {
                        _id: id,
                        email: email,
                        fullname: fullname,
                        address: address,
                        phone: phone,
                        totalProject: totalProject,
                        statusAccount: statusAccount,
                        avatar: avatar,
                        description: description,
                    },
                });
            } else {
                res.status(404).json({
                    status: 404,
                    message: 'No valid entry found',
                    result: result,
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
