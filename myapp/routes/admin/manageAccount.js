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


router.get('/', checkAuthAdmin,  (req, res, next) => {
    User.find()
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

router.get('/:id', checkAuthAdmin, (req, res, next) => {
    const id = req.params.id;
    User.findById(id)
    .exec()
    .then(result => {
        res.status(200).json({
            status: 200,
            result,
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
router.delete('/:userID', checkAuthAdmin, (req, res, next) => {
    User.remove({
            _id: req.params.userID
        })
        .exec()
        .then(result => {
            res.status(200).json({
                status: 200,
                message: 'user deleted',
                result: result
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

module.exports = router;
