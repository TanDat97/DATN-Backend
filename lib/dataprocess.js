const mongoose = require('mongoose');

const User = require('../models/userModel');
const Project = require('../models/projectModel');
const Company = require('../models/companyModel');
const Transaction = require('../models/transactionModel');
const SellDetail = require('../models/selldetailModel');
const RentDetail = require('../models/rentdetailModel');
const Waiting = require('../models/waitingModel');

function checkCodeAvailable(project, buyer, code, ownerid) {
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



module.exports.checkCodeAvailable = checkCodeAvailable
