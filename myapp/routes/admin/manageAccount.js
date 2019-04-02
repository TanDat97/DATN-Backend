const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const checkAuthAdmin = require('../../middleware/checkAuthAdmin');
const libFunction = require('../../lib/function');
const User = require('../../models/userModel');
const Project = require('../../models/projectModel');
const Admin = require('../../models/adminModel');

const numItem = 30

router.get('/all/:page', checkAuthAdmin, (req, res, next) => {
    const page = req.params.id;
    User.find()
    .select()
    .exec()
    .then(results => {
        if (results.length >= 0 && results.length <= numItem) {
            res.status(200).json({
                status: 200,
                count: results.length,
                page: 1,
                accounts: results,
            });
        } else if (results.length >= numItem && page > 0) {
            var i
            var accounts=[]
            for (i=(page-1)*numItem; i < page*numItem; i++)
                accounts.push(results[i])
            res.status(200).json({
                status: 200,
                count: results.length,
                page: page,
                accounts: accounts,
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
    User.findById(id)
    .exec()
    .then(result => {
        if (result !== null) {
            res.status(200).json({
                status: 200,
                account: result,
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

router.patch('/:id', checkAuthAdmin, (req, res, next) => {
    const id = req.params.id;
    const username = req.body.username;
    const fullname = req.body.fullname;
    const address = req.body.address;
    const email = req.body.email;
    const phone = req.body.phone;
    const totalProject = req.body.totalProject;
    const statusAccount = req.body.statusAccount;

    User.update({
        _id: id
    }, {
            $set: {
                username: username,
                fullname: fullname,
                address: address,
                email: email,
                phone: phone,
                totalProject: totalProject,
                statusAccount: statusAccount,
            }
        })
        .exec()
        .then(result => {
            if (result.nModified > 0) {
                res.status(200).json({
                    status: 200,
                    message: 'update account success',
                    project: {
                        _id: id,
                        username: username,
                        fullname: fullname,
                        address: address,
                        email: email,
                        phone: phone,
                        totalProject: totalProject,
                        statusAccount: statusAccount,
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
    User.remove({
            _id: req.params.id
        })
        .exec()
        .then(result => {
            Project.remove({ownerid: req.params.id}).exec().then(result => console.log('delete project success'))
            if(result.n > 0) {
                res.status(200).json({
                    status: 200,
                    message: 'account deleted',
                    result: result
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
