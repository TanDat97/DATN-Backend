const express = require('express');
const router = express.Router();
const Project = require('../models/projectModel');
const mongoose = require('mongoose');

// var MongoClient = require('mongodb').MongoClient; // connect online
// var uri = 'mongodb+srv://dat:dat123456@cluster0-74q3u.mongodb.net/test?retryWrites=true'; // connect online

router.get('/', (req, res, next) => {
    Project.find()
        .select('_id id name investor price unit area type info')
        .exec()
        .then(results => {
            console.log(results);
            const response = {
                count: results.length,
                project: results.map(result => {
                    return {
                        _id: result._id,
                        name: result.name,
                        price: result.price,
                        unit: result.unit,
                    }
                })
            };
            if (results.length >= 0) {
                res.status(200).json({
                    status: 200,
                    response,
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
    Project.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json({
                status: 200,
                doc,
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
