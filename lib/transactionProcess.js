const mongoose = require('mongoose')
const moment = require('moment')

const User = require('../models/userModel')
const Project = require('../models/projectModel')
const News = require('../models/newsModel')
const Company = require('../models/companyModel')
const Transaction = require('../models/transactionModel')
const SellDetail = require('../models/selldetailModel')
const RentDetail = require('../models/rentdetailModel')
const Waiting = require('../models/waitingModel')

function checkExpireTransaction() {
    setInterval(() => {
        Transaction.find({
            verify: false,
            status: 1,
        })
        .exec()
        .then(result => {
            result.map(e => {
                const now = moment().unix()
                console.log((now - e.createTime)/86400)
            })
        })
        .catch(err => console.log(err))
    },3000)
}

module.exports.checkExpireTransaction = checkExpireTransaction
