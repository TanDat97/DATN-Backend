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

router.post('/deal', checkAuth, (req, res, next) => {
    const id = req.body.id
    const deal = {
        total: Number(req.body.total),
        deposit: Number(req.body.deposit),
        typeofpay: Number(req.body.typeofpay),
        datedeal: Number(req.body.datedeal),
        description: req.body.description,
        complete: JSON.parse(req.body.complete),
    }
    Transaction.findOneAndUpdate({
        _id: req.body.transactionid,
        seller: req.userData.id,
    },{
        $set: {
            updateTime: req.body.updateTime,
        }
    })
    .exec()
    .then(result => console.log(req.body.updateTime))
    .catch(err  => console.log(err))
    if(deal.complete === true) {
        SellDetail.findOneAndUpdate({
            _id: id,
            seller: req.userData.id,
        },{
            $set: {
                deal: deal,
            }
        })
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    status: 200,
                    message: 'update deal complete: true',
                    deal: deal,
                    prev: result,
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
    } else if(deal.complete === false) {
        SellDetail.findOneAndUpdate({
            _id: id,
            seller: req.userData.id,
        },{
            $set: {
                'deal.complete': deal.complete,
            }
        })
        .exec()
        .then(result => {
            if (result) {
                deal.total = result.deal.total
                deal.deposit = result.deal.deposit
                deal.typeofpay = result.deal.typeofpay
                deal.datedeal = result.deal.datedeal
                deal.description = result.deal.description 
                res.status(200).json({
                    status: 200,
                    message: 'update deal complete: false',
                    deal: deal,
                    prev: result,
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
    } else {
        res.status(409).json({
            status: 409,
            error: 'request fail',
        })
    }
})

router.post('/legality', checkAuth, (req, res, next) => {
    const id = req.body.id
    const legality = {
        government: req.body.government,
        certificate: req.body.certificate,
        contract: req.body.contract,
        complete: JSON.parse(req.body.complete),
    }
    Transaction.findOneAndUpdate({
        _id: req.body.transactionid,
        seller: req.userData.id,
    },{
        $set: {
            updateTime: req.body.updateTime,
        }
    })
    .exec()
    .then(result => console.log(req.body.updateTime))
    .catch(err  => console.log(err))
    if(legality.complete === true) {
        SellDetail.findOneAndUpdate({
            _id: id,
            seller: req.userData.id,
        },{
            $set: {
                legality: legality,
            }
        })
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    status: 200,
                    message: 'update legality complete: true',
                    legality: legality,
                    prev: result,
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
    } else if(legality.complete === false) {
        SellDetail.findOneAndUpdate({
            _id: id,
            seller: req.userData.id,
        },{
            $set: {
                'legality.complete': legality.complete,
            }
        })
        .exec()
        .then(result => {
            if (result) {
                legality.government = result.legality.government
                legality.certificate = result.legality.certificate
                legality.contract = result.legality.contract
                res.status(200).json({
                    status: 200,
                    message: 'update legality complete: false',
                    legality: legality,
                    prev: result,
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
    } else {
        res.status(409).json({
            status: 409,
            error: 'request fail',
        })
    }
})

router.post('/deposit', checkAuth, (req, res, next) => {
    const id = req.body.id
    const deposit = {
        rest: req.body.rest,
        detail: req.body.detail,
        complete: JSON.parse(req.body.complete),
    }
    Transaction.findOneAndUpdate({
        _id: req.body.transactionid,
        seller: req.userData.id,
    },{
        $set: {
            updateTime: req.body.updateTime,
        }
    })
    .exec()
    .then(result => console.log(req.body.updateTime))
    .catch(err  => console.log(err))
    if(deposit.complete === true) {
        SellDetail.findOneAndUpdate({
            _id: id,
            seller: req.userData.id,
        },{
            $set: {
                deposit: deposit,
            }
        })
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    status: 200,
                    message: 'update deposit complete: true',
                    deposit: deposit,
                    prev: result,
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
    } else if(deposit.complete === false) {
        SellDetail.findOneAndUpdate({
            _id: id,
            seller: req.userData.id,
        },{
            $set: {
                'deposit.complete': deposit.complete,
            }
        })
        .exec()
        .then(result => {
            if (result) {
                deposit.rest = result.deposit.rest
                deposit.detail = result.deposit.detail
                res.status(200).json({
                    status: 200,
                    message: 'update deposit complete: false',
                    deposit: deposit,
                    prev: result,
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
    } else {
        res.status(409).json({
            status: 409,
            error: 'request fail',
        })
    }
})

router.post('/contract', checkAuth, (req, res, next) => {
    const id = req.body.id
    const contract = {
        datesign: req.body.datesign,
        number: req.body.number,
        contractImage: req.body.contractImage,
        complete: JSON.parse(req.body.complete),
    }
    Transaction.findOneAndUpdate({
        _id: req.body.transactionid,
        seller: req.userData.id,
    },{
        $set: {
            updateTime: req.body.updateTime,
        }
    })
    .exec()
    .then(result => console.log(req.body.updateTime))
    .catch(err  => console.log(err))
    if(contract.complete === true) {
        SellDetail.findOneAndUpdate({
            _id: id,
            seller: req.userData.id,
        },{
            $set: {
                contract: contract,
            }
        })
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    status: 200,
                    message: 'update contract complete: true',
                    contract: contract,
                    prev: result,
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
    } else if(contract.complete === false) {
        SellDetail.findOneAndUpdate({
            _id: id,
            seller: req.userData.id,
        },{
            $set: {
                'contract.complete': contract.complete,
            }
        })
        .exec()
        .then(result => {
            if (result) {
                contract.datesign = result.contract.datesign
                contract.number = result.contract.number
                contract.contractImage = result.contract.contractImage
                res.status(200).json({
                    status: 200,
                    message: 'update contract complete: false',
                    contract: contract,
                    prev: result,
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
    } else {
        res.status(409).json({
            status: 409,
            error: 'request fail',
        })
    }
})


module.exports = router;
