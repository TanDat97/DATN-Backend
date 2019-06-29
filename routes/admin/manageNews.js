const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const checkAuthAdmin = require('../../middleware/checkAuthAdmin')
const libFunction = require('../../lib/function')
const News = require('../../models/newsModel')

const constant = require('../../lib/constant')

router.get('/all/:page', checkAuthAdmin, (req, res, next) => {
    const page = parseInt(req.params.page) - 1
    News.find().sort({'createTime': -1}).skip(page*constant.numItem).limit(constant.numItem)
    .select()
    .exec()
    .then(results => {
        if (results.length > 0) {
            res.status(200).json({
                status: 200,
                count: results.length,
                page: page + 1,
                news: results,
            })
        } else {
            res.status(404).json({
                status: 404,
                message: 'No valid entry found',
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            status: 500,
            error: err
        })
    })
})

router.get('/:id', checkAuthAdmin, (req, res, next) => {
    const id = req.params.id
    News.findById(id)
    .exec()
    .then(result => {
        res.status(200).json({
            status: 200,
            newsResult: result,
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            status: 500,
            error: err
        })
    })
})

router.post('/', checkAuthAdmin, (req, res, next) => {
    const news= new News({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        content: req.body.content,
        type: req.body.type,
        createTime: req.body.createTime,
        updateTime: req.body.updateTime,
    })
    news
    .save()
    .then(result => {
        res.status(201).json({
            status: 201,
            message: 'add news success',
            news: result,
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            status: 500,
            error: err,
        })
    })

})

router.post('/edit/:id', checkAuthAdmin, (req, res, next) => {
    const id = req.params.id
    const title = req.body.title
    const content = req.body.content
    const type = req.body.type
    const createTime = req.body.createTime
    const updateTime = req.body.updateTime
    News.updateOne({
        _id: id
    }, {
        title: title,
        content: content,
        type: type,
        updateTime: updateTime,
    })
    .exec()
    .then(result => {
        if (result.nModified > 0) {
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
                }
            })
        } else {
            res.status(404).json({
                status: 404,
                message: 'No valid entry found'
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            status: 500,
            error: err
        })
    })
})

router.delete('/:id', checkAuthAdmin, (req, res, next) => {
    const id = req.params.id
    News.deleteOne({
        _id: id
    })
    .exec()
    .then(result => {
        if (result.n > 0) {
            res.status(200).json({
                status: 200,
                message: 'delete news success',
                request: {
                    type: 'DELETE',
                }
            })
        } else {
            res.status(404).json({
                status: 404,
                message: 'No valid entry found'
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            status: 500,
            error: err
        })
    })
})

module.exports = router
