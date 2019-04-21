const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const checkAuth = require('../middleware/checkAuth');
const libFunction = require('../lib/function');
const News = require('../models/newsModel');

const numItem = 30;

router.get('/all/:type/:page', (req, res, next) => {
    var type = req.params.type
    const page = parseInt(req.params.page) - 1
    // if(type === 1)
    //     type = 'Phong thủy'
    // else if(type === 2)
    //     type = 'Nội thất'
    // else if(type === 3)
    //     type = 'Ngoại thất'
    // else if(type === 4)
    //     type = 'Xây dựng'
    // else if(type === 5)
    //     type = 'Kiến trúc'
    // else if(type === 6)
    //     type = 'Tài chính'
    // else if(type === 7)
    //     type = 'Luật bất động sản'
    News.find({
        type: type,
    }).sort({'createTime': -1}).skip(page).limit(numItem)
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
