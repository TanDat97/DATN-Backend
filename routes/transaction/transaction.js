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
const Waiting = require('../../models/waitingModel');

const numItem = 30

router.get('/listrequest', checkAuth, (req, res, next) => {
    const projectid = req.body.projectid
    Waiting.find({
        project: projectid,
    })
    .populate({path:'project requests.user'})
    .exec()
    .then(result => {
        res.status(200).json({
            status: 200,
            message: 'get list requests success',
            result: result,
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

router.post('/addwaitingrequest', checkAuth, (req, res, next) => {
    const projectid = req.body.projectid
    const userid = req.userData.id
    const createTime = req.body.createTime
    const money = req.body.money
    const description = req.body.description
    Waiting.find({
        project: projectid,
    })
    .exec()
    .then(result => {
        if (result[0].createdTransaction === true) {
            res.status(203).json({
                status: 203,
                message: 'this project is now in transaction',
            })
        } else if (result.length >= 1) {
            if(result[0].requests.length >= 20)  {
                return res.status(204).json({
                    status: 204,
                    message: 'can not add more request transaction to this project',
                })
            }
            const isInArray = result[0].requests.some(temp => {
                return temp.user === userid;
            })
            if (isInArray) {
                return res.status(409).json({
                    status: 409,
                    message: 'user has requested transaction to this project',
                })
            } else if (!isInArray) {
                const request = {
                    user: userid,
                    createTime: createTime,
                    money: money,
                    description: description,
                }
                Waiting.findOneAndUpdate({ project: projectid }, { $push: { requests: request } })
                .exec()
                .then(ex => {
                    res.status(201).json({
                        status: 201,
                        message: 'add to list request success',
                        result: request,
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        status: 500,
                        error: err,
                    })
                })
            }
        } else if (result.length === 0) {
            const waiting = new Waiting({
                _id: new mongoose.Types.ObjectId(),
                project: projectid,
                createdTransaction: false,
                choosenone: '0',
                requests: [{
                    user: userid,
                    createTime: createTime,
                    money: money,
                    description: description,
                }],
            })
            waiting
            .save()
            .then(result => {
                res.status(201).json({
                    status: 201,
                    message: 'create new list request project success',
                    result: result,
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    status: 500,
                    error: err,
                })
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            status: 500,
            error: err,
        })
    })
})

router.post('/deletewaitingrequest', checkAuth, (req, res, next) => {
    const projectid = req.body.projectid
    const userid = req.userData.id
    Waiting.find({
        project: projectid,
    })
    .exec()
    .then(result => {
        const isInArray = result[0].requests.some(temp => {
            return temp.user === userid;
        })
        if (result[0].createdTransaction === true) {
            res.status(203).json({
                status: 203,
                message: 'this project is now in transaction',
            })
        } else if (result.length >= 1 && isInArray) {
            Waiting.findOneAndUpdate({ project: projectid }, { $pull: { requests: { user: userid} } })
            .exec()
            .then(ex => {
                res.status(201).json({
                    status: 201,
                    message: 'delete user from list requests success',
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    status: 500,
                    error: err,
                })
            })
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
        })
    })
})

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
    Waiting.findOneAndUpdate({ project: req.body.project }, { createdTransaction: true })
    .exec()
    .then(ex => console.log('change created transaction'))
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

router.get('/history/:page', checkAuth, (req, res, next) => {
    const userid = req.userData.id
    const page = parseInt(req.params.page) - 1
    Transaction.find({
        $or: [{seller: userid},{buyer: userid}]
    }).sort({ 'createTime': -1 }).skip(page*numItem).limit(numItem)
    .populate({
        path: 'project'
    })
    .exec()
    .then(result => {
        res.status(200).json({
            status: 200,
            message: 'get history transaction success',
            history: result,
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

router.get('/detail/:id/:type', checkAuth, (req, res, next) => {
    const id = req.params.id
    const type = Number(req.params.type)
    const userid = req.userData.id
    Transaction.findOne({
        _id: id,
        $or: [{seller: userid},{buyer: userid}],
    })
    .populate({
        path: type === 1 ? 'project selldetail' : 'project rentdetail',
    })
    .exec()
    .then(result => {
        res.status(200).json({
            status: 200,
            message: 'get detail transaction success',
            transaction: result,
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

module.exports = router;
