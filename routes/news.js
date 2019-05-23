const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const checkAuth = require('../middleware/checkAuth');
const libFunction = require('../lib/function');
const News = require('../models/newsModel');

const numItem = 30;

router.get('/all/:type/:page', (req, res, next) => {
    const type = req.params.type
    const page = parseInt(req.params.page) - 1
    News.find({
        type: type,
    }).sort({'createTime': -1}).skip(page*numItem).limit(numItem)
    .select()
    .exec()
    .then(results => {
        if (results.length > 0) {
            res.status(200).json({
                status: 200,
                count: results.length,
                page: page + 1,
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

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    News.findById(id)
    .exec()
    .then(result => {
        res.status(200).json({
            status: 200,
            news: result,
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
