const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const checkAuth = require('../middleware/checkAuth');
const libFunction = require('../lib/function');
const User = require('../models/userModel');
const Comment = require('../models/commentModel');

router.get('/all/:id', (req, res, next) => {
    const projectid = req.params.id
    Comment.find({
        projectid: projectid,
    })
    .sort({'createTime': -1})
    .select()
    .exec()
    .then(results => {
        if (results.length > 0) {
            res.status(200).json({
                status: 200,
                count: results.length,
                comments: results,
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
            createTime: req.body.createTime,
            updateTime: req.body.updateTime,
            content: req.body.content,
            star: req.body.star,
            projectid: req.body.projectid,
            avatar: req.body.avatar,
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

router.post('/edit/:id', checkAuth, (req, res, next) => {
    const id = req.params.id;
    const userid = req.userData.id;
    const fullname = req.body.fullname;
    const createTime = req.body.createTime;
    const updateTime = req.body.updateTime;
    const content = req.body.content;
    const star = req.body.star;
    const projectid = req.body.projectid;

    Comment.update({
        _id: id,
        userid: userid,
    }, {
        $set: {
            fullname: fullname,
            updateTime: updateTime,
            content: content,
            star: star,
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

router.delete('/:id', checkAuth, (req, res, next) => {
    Comment.remove({
        _id: req.params.id,
        userid: req.userData.id,
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
