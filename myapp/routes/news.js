const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const checkAuth = require('../middleware/checkAuth');
const libFunction = require('../lib/function');
const News = require('../models/newsModel');

const numItem = 30;

router.get('/all/:type/:page', (req, res, next) => {
    var type = req.params.type
    const page = req.params.page
    if(type === 'phong-thuy')
        type = 'Phong thủy'
    else if(type === 'noi-that-ngoai-that')
        type = 'Nội thất - Ngoại thất'
    else if(type === 'xay-dung-kien-truc')
        type = 'Xây dựng - Kiến trúc'
    News.find({
        type: type,
    })
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
