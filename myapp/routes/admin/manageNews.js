const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const checkAuthAdmin = require('../../middleware/checkAuthAdmin');
const libFunction = require('../../lib/function');
const News = require('../../models/newsModel');

router.get('/', checkAuthAdmin, (req, res, next) => {
    News.find()
    .select()
    .exec()
    .then(results => {
        if (results.length >= 0) {
            res.status(200).json({
                status: 200,
                count: results.length,
                news: results,
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
    News.findById(id)
    .exec()
    .then(result => {
        res.status(200).json({
            status: 200,
            newsResult: result,
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

router.post('/', checkAuthAdmin, (req, res, next) => {
    const news= new News({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        content: req.body.content,
        type: req.body.type,
    });
    news
        .save()
        .then(result => {
            res.status(201).json({
                status: 201,
                message: 'add news success',
                createdNews: {
                    result,
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3001/news/' + result._id,
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: 500,
                error: err,
            });
        });

});

router.patch('/:id', checkAuthAdmin, (req, res, next) => {
    const id = req.params.id;
    const title = req.body.title
    const content = req.body.content
    const type = req.body.type
    News.update({
        _id: id
    }, {
            $set: {
                title: title,
                content: content,
                type: type,
            }
        })
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    status: 200,
                    message: 'update news success',
                    news: {
                        _id: id,
                        title: title,
                        content: content,
                        type: type,
                    },
                    request: {
                        type: 'PATCH',
                        url: 'http://localhost:3001/news/' + id,
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
    const id = req.params.id;
    News.remove({
        _id: id
    })
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    status: 200,
                    message: 'delete news success',
                    request: {
                        type: 'DELETE',
                        url: 'http://localhost:3001/news/',
                    }
                });
            } else {
                res.status(404).json({
                    status: 200,
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

module.exports = router;
