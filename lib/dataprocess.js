const mongoose = require('mongoose')

const User = require('../models/userModel')
const Project = require('../models/projectModel')
const News = require('../models/newsModel')
const Company = require('../models/companyModel')
const Transaction = require('../models/transactionModel')
const SellDetail = require('../models/selldetailModel')
const RentDetail = require('../models/rentdetailModel')
const Waiting = require('../models/waitingModel')

function countAccount(){
    return new Promise((resolve,reject) => {
        User.count({}, (err, count) => {
            if(err)
                reject(err)
            resolve(count)
        })
    })
}

function countProject(){
    return new Promise((resolve,reject) => {
        Project.count({}, (err, count) => {
            if(err)
                reject(err)
            resolve(count)
        })
    })
}

function countNews(){
    return new Promise((resolve,reject) => {
        News.count({}, (err, count) => {
            if(err)
                reject(err)
            resolve(count)
        })
    })
}

function countCompany(){
    return new Promise((resolve,reject) => {
        Company.count({}, (err, count) => {
            if(err)
                reject(err)
            resolve(count)
        })
    })
}

function getListTransaction(seller, buyer) {
    return new Promise((resolve,reject) => {
        Transaction.find({
            $or: [{seller: seller}, {buyer: buyer}]
        })
        .exec()
        .then(results => {
            var temp = {
                seller: 0,
                buyer: 0,
            }
            results.forEach(element => {
                if(element.seller === seller)
                    temp.seller += 1
                if(element.buyer === buyer)
                    temp.buyer +=1                
            })
            resolve(temp)
        })
        .catch(err => {
            console.log(err)
            reject('connect database error')
        })
    })
}

function checkCodeAvailable(buyer, project, code, ownerid) {
    return new Promise((resovlve, reject) => {
        Project.findOne({
            _id: project,
            ownerid: ownerid,
            'codelist.code': code,
            'codelist.sold': false,
        })
        .exec()
        .then(result => {
            if(result === null) {
                console.log(code + ' is not available')
                reject('can not create transaction because the code or project is not available')
            } else {
                Waiting.update({
                    project: project,
                    'requests.user': buyer,
                }, {
                    $set: {
                        'requests.$.createdTransaction': true,
                    }
                })
                .exec()
                .then(ex => {
                    if(ex.nModified === 0) {
                        console.log('this account created transaction before')
                        reject('this account created transaction before')
                    } else {
                        resovlve('this request can be created transaction')
                    }
                })
                .catch(err => {
                    console.log(err)
                    reject('connect database error')
                })
            }
        })
        .catch(err => {
            console.log(err)
            reject('connect database error')
        })    
    })
}

module.exports.countAccount = countAccount
module.exports.countProject = countProject
module.exports.countNews = countNews
module.exports.countCompany = countCompany
module.exports.getListTransaction = getListTransaction
module.exports.checkCodeAvailable = checkCodeAvailable
