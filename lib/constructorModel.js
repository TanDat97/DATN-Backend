const mongoose = require('mongoose')

const User = require('../models/userModel')
const Project = require('../models/projectModel')
const Company = require('../models/companyModel')
const Transaction = require('../models/transactionModel')
const SellDetail = require('../models/selldetailModel')
const RentDetail = require('../models/rentdetailModel')
const Waiting = require('../models/waitingModel')

function constructorUser(identify, fullname, address, phone, description, email, statusAccount, avatar, company, hash) {
    var temp = User({
        _id: new mongoose.Types.ObjectId(),
        identify: identify,
        fullname: fullname,
        address: address,
        phone: phone,
        description: description,
        email: email,
        totalProject: 0,
        statusAccount: statusAccount,
        avatar: avatar,
        company: company,
        lock: false,
        verify: true,
        permission: false,
        hash: hash,
    })
    return temp
}

function constructorProject (name, investor, price, unit, area, address, type, info, lat, long, ownerid, fullname, phone, email, avatar, statusProject, codelist, createTime, url, publicId) {
    var project = new Project({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        investor: investor,
        price: price,
        unit: unit,
        area: area,
        address: address,
        type: type,
        info: info,
        lat: lat,
        long: long,
        ownerid: ownerid,
        fullname: fullname,
        phone: phone,
        email: email,
        avatar: avatar,
        statusProject: statusProject,
        amount: codelist.length,
        createTime: createTime,
        updateTime: createTime,
        verify: false,
        allowComment: true,
        codelist: codelist,
        url: url,
        publicId: publicId,
    })
    return project
}

function constructorCompany (hash, companyname, address, email, phone, website, status, avatar, description, createTime, createBy) {
    var company= new Company({
        _id: new mongoose.Types.ObjectId(),
        password: hash,
        companyname: companyname,
        address: address,
        email: email,
        phone: phone,
        website: website,
        totalProject: 0,
        status: status,
        avatar: avatar,
        description: description,
        createTime: createTime,
        updateTime: createTime,
        createBy: createBy,
        lock: false,
        verify: false,
        hash: 0,
        employees: [],
    })
    return company
}

function constructorTransaction (step, typeproject, typetransaction, project, code, seller, buyer, company, createTime) {
    var transaction = Transaction({
        _id: new mongoose.Types.ObjectId(),
        active: true,
        verify: false,
        step: step,
        typeproject: typeproject,
        typetransaction: typetransaction,
        project: project,
        code: code,
        seller: seller,
        buyer: buyer,
        company: company,
        createTime: createTime,
        updateTime: createTime,
        selldetail: '0',
        rentdetail: '0',
        complete: false,
    })
    return transaction
}

module.exports.constructorUser = constructorUser
module.exports.constructorProject = constructorProject
module.exports.constructorCompany = constructorCompany
module.exports.constructorTransaction = constructorTransaction
