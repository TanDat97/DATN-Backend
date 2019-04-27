const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const checkAuthAdmin = require('../../middleware/checkAuthAdmin');
const libFunction = require('../../lib/function');
const User = require('../../models/userModel');
const Project = require('../../models/projectModel');
const Comment = require('../../models/commentModel');

const numItem = 30

router.get('/all/:page', checkAuthAdmin, (req, res, next) => {
    const page = parseInt(req.params.page) - 1
    User.find().skip(page).limit(numItem)
    .select()
    .exec()
    .then(results => {
        if (results.length > 0) {
            res.status(200).json({
                status: 200,
                count: results.length,
                page: page + 1,
                accounts: results,
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
    const fullname = req.body.fullname;
    const address = req.body.address;
    const email = req.body.email;
    const phone = req.body.phone;
    const totalProject = req.body.totalProject;
    const statusAccount = req.body.statusAccount;
    const description = req.body.description;
    User.update({
        _id: id,
        email: email,
    }, {
        $set: {
            fullname: fullname,
            address: address,
            phone: phone,
            totalProject: totalProject,
            statusAccount: statusAccount,
            description: description,
        }
    })
    .exec()
    .then(result => {
        if (result.nModified > 0) {
            res.status(200).json({
                status: 200,
                message: 'update account success',
                account: {
                    _id: id,
                    fullname: fullname,
                    address: address,
                    email: email,
                    phone: phone,
                    totalProject: totalProject,
                    statusAccount: statusAccount,
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
    User.remove({
        _id: req.params.id
    })
    .exec()
    .then(result => {
        Project.remove({ownerid: req.params.id}).exec().then(result => console.log('delete project success'))
        Comment.remove({userid: req.params.id}).exec().then(result => console.log('delete comment success'))
        if(result.n > 0) {
            res.status(200).json({
                status: 200,
                message: 'account deleted',
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
