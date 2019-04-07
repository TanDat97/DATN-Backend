const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const checkAuth = require('../middleware/checkAuth');
const libFunction = require('../lib/function');
const User = require('../models/userModel');
const Project = require('../models/projectModel');
const Comment = require('../models/commentModel');

router.get('/all', (req, res, next) => {
    const projectid = req.body.projectid
    Comment.find({
        projectid: projectid,
    })
    .select()
    .exec()
    .then(results => {
        if (results.length > 0) {
            res.status(200).json({
                status: 200,
                count: results.length,
                comment: results,
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
    User.findById(req.userData.id)
    .exec()
    .then(user => {
        const comment = Comment({
            _id: new mongoose.Types.ObjectId(),
            userid: req.userData.id,
            fullname: req.body.fullname,
            commentTime: req.body.commentTime,
            updateTime: req.body.updateTime,
            content: req.body.content,
            star: req.body.star,
            accountType: req.body.accountType,
            projectid: req.body.projectid,
        });
        comment
        .save()
        .then(result => {
            res.status(201).json({
                status: 201,
                message: 'add comment success',
                comment: result,
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: 500,
                error: err
            });
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

router.patch('/:id', checkAuth, (req, res, next) => {
    const id = req.params.id;
    const userid = req.userData.id;
    const fullname = req.body.fullname;
    const createTime = req.body.createTime;
    const updateTime = req.body.updateTime;
    const content = req.body.content;
    const star = req.body.star;
    const accountType = req.body.accountType;
    const projectid = req.body.projectid;

    Comment.update({
        _id: id,
        userid: userid,
    }, {
        $set: {
            fullname: fullname,
            createTime: createTime,
            updateTime: updateTime,
            content: content,
            star: star,
            accountType: accountType,
        }
    })
    .exec()
    .then(result => {
        if (result.nModified > 0) {
            res.status(200).json({
                status: 200,
                message: 'update comment success',
                comment: {
                    _id: id,
                    userid: userid,
                    fullname: fullname,
                    createTime: createTime,
                    updateTime: updateTime,
                    content: content,
                    star: star,
                    accountType: accountType,
                    projectid: projectid,
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

router.delete('/', checkAuth, (req, res, next) => { //checkAuthWithID
    Comment.remove({
        _id: req.body.commentid,
        userid: req.userData.userid,
    })
    .exec()
    .then(result => {
        if(result.n > 0) {
            res.status(200).json({
                status: 200,
                message: 'comment deleted',
                result: result,
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
