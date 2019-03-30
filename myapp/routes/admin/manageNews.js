const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const checkAuthAdmin = require('../../middleware/checkAuthAdmin');
const libFunction = require('../../lib/function');
const News = require('../../models/newsModel');

const numItem = 30

router.get('/all/:page', checkAuthAdmin, (req, res, next) => {
    const page = req.params.page
    News.find()
    .select()
    .exec()
    .then(results => {
        if (results.length >= 0 && results.length <= numItem) {
            res.status(200).json({
                status: 200,
                count: results.length,
                page: 1,
                news: results,
            });
        } else if (results.length >= numItem && page > 0) {
            var i
            var news=[]
            for (i=(page-1)*numItem; i < page*numItem; i++)
                news.push(results[i])
            res.status(200).json({
                status: 200,
                count: results.length,
                page: page,
                news: news,
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
        createTime: req.body.createTime,
        updateTime: req.body.updateTime,
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
    const createTime = req.body.createTime
    const updateTime = req.body.updateTime
    News.update({
        _id: id
    }, {
            $set: {
                title: title,
                content: content,
                type: type,
                createTime: createTime,
                updateTime: updateTime,
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
                        createTime: createTime,
                        updateTime: updateTime, 
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
