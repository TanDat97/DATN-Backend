const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const checkAuth = require('../../middleware/check-auth');
const libFunction = require('../../lib/function');
const User = require('../../models/userModel');
const Project = require('../../models/projectModel');

router.delete('/:userID', checkAuth, (req, res, next) => {
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