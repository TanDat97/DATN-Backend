const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const checkAuth = require('../../middleware/checkAuth');
const libFunction = require('../../lib/function');
const User = require('../../models/userModel');
const Project = require('../../models/projectModel');
const Company = require('../../models/companyModel');
const Transaction = require('../../models/transactionModel');
const SellDetail = require('../../models/selldetailModel');
const RentDetail = require('../../models/rentdetailModel');


router.post('/create', checkAuth, (req, res, next) => {
    const transaction = Transaction({
        _id: new mongoose.Types.ObjectId(),
        active: true,
        verify: false,
        step: req.body.step,
        typeproject: req.body.typeproject,
        typetransaction: req.body.typetransaction,
        project: req.body.project,
        seller: req.userData.id,
        buyer: req.body.buyer,
        company: req.body.company,
        createTime: req.body.createTime,
        updateTime: req.body.updateTime,
        selldetail: '0',
        rentdetail: '0',
    })
    if(transaction.typetransaction === 1) {
        const transactiondetail = SellDetail({
            _id: new mongoose.Types.ObjectId(),
            seller: req.userData.id,
            buyer: req.body.buyer,
            transactionid: transaction._id,
        })
        transactiondetail
        .save()
        .then(resultdetail => {
            transaction.selldetail=transactiondetail._id
            transaction
            .save()
            .then(result => {
                res.status(201).json({
                    status: 201,
                    message: 'create sell transaction success',
                    transaction: result,
                    transactiondetail: resultdetail,
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    status: 500,
                    error: err
                })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: 500,
                error: err
            })
        })
    } else if(transaction.typetransaction === 2) {
        const transactiondetail = RentDetail({
            _id: new mongoose.Types.ObjectId(),
            transactionid: transaction._id,
        })
        transactiondetail
        .save()
        .then(resultdetail => {
            transaction.selldetail=transactiondetail._id
            transaction
            .save()
            .then(result => {
                res.status(201).json({
                    status: 201,
                    message: 'create rent transaction success',
                    transaction: result,
                    transactiondetail: resultdetail,
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    status: 500,
                    error: err
                })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: 500,
                error: err
            })
        })
    } else {
        res.status(409).json({
            status: 409,
            error: 'request fail'
        })
    }
    
})

router.post('/changestatus', checkAuth, (req, res, next) => {
    const transactionid = req.body.id
    const active = req.body.active
    Transaction.update({
        _id: transactionid,
        seller: req.userData.id,
    },{
        $set: {
            active: active,
        }
    })
    .exec()
    .then(result => {
        if (result.nModified > 0) {
            res.status(200).json({
                status: 200,
                message: 'change status transaction success',
                active: active,
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

module.exports = router;
