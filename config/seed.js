const fs = require('fs')
const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose')

const Admin = require('../models/adminModel')
const Comment = require('../models/commentModel')
const Company = require('../models/companyModel')
const News = require('../models/newsModel')
const Project = require('../models/projectModel')
const RentDetail = require('../models/rentdetailModel')
const SavedProject = require('../models/savedProjectModel')
const SellDetail = require('../models/selldetailModel')
const Transaction = require('../models/transactionModel')
const User = require('../models/userModel')
const Waiting = require('../models/waitingModel')
const mongo = require('./mongo')



mongoose.connect(mongo.url, mongo.options)
.then(success => {
    console.log('Connect Database Success')
})
.catch(err => {
    console.log('Connect Database Failed: ' + err)
    process.exit()
})

//insert admin
var filedata = fs.readFileSync(__dirname + '/SampleData/admin.json')
var admin = JSON.parse(filedata)
Admin.insertMany(admin).then(result => {
    console.log('insert admin success!')
})
.catch(err => console.log(err))

//inserrt comment
filedata = fs.readFileSync(__dirname + '/SampleData/comment.json')
var comment = JSON.parse(filedata)
Comment.insertMany(comment).then(result => {
    console.log('insert comment success!')
})
.catch(err => console.log(err))

//insert company
filedata = fs.readFileSync(__dirname + '/SampleData/company.json')
var company = JSON.parse(filedata)
Company.insertMany(company).then(result => {
    console.log('insert company success!')
})
.catch(err => console.log(err))

//insert news
filedata = fs.readFileSync(__dirname + '/SampleData/news.json')
var news = JSON.parse(filedata)
News.insertMany(news).then(result => {
    console.log('insert news success!')
})
.catch(err => console.log(err))

//insert  project
filedata = fs.readFileSync(__dirname + '/SampleData/project.json')
var project = JSON.parse(filedata)
Project.insertMany(project).then(result => {
    console.log('insert project success!')
})
.catch(err => console.log(err))

//insert rentdetail
filedata = fs.readFileSync(__dirname + '/SampleData/rentdetail.json')
var rentdetail = JSON.parse(filedata)
RentDetail.insertMany(rentdetail).then(result => {
    console.log('insert rentdetail success!')
})
.catch(err => console.log(err))

//insert savedproject
filedata = fs.readFileSync(__dirname + '/SampleData/savedproject.json')
var savedproject = JSON.parse(filedata)
SavedProject.insertMany(savedproject).then(result => {
    console.log('insert rentdetail success!')
})
.catch(err => console.log(err))


//insert selldetail
filedata = fs.readFileSync(__dirname + '/SampleData/selldetail.json')
var selldetail = JSON.parse(filedata)
SellDetail.insertMany(selldetail).then(result => {
    console.log('insert selldetail success!')
})
.catch(err => console.log(err))

//insert transaction
filedata = fs.readFileSync(__dirname + '/SampleData/transaction.json')
var transaction = JSON.parse(filedata)
Transaction.insertMany(transaction).then(result => {
    console.log('insert transaction success!')
})
.catch(err => console.log(err))

//insert user
filedata = fs.readFileSync(__dirname + '/SampleData/user.json')
var user = JSON.parse(filedata)
User.insertMany(user).then(result => {
    console.log('insert user success!')
})
.catch(err => console.log(err))

//insert waiting
filedata = fs.readFileSync(__dirname + '/SampleData/waiting.json')
var waiting = JSON.parse(filedata)
Waiting.insertMany(waiting).then(result => {
    console.log('insert waiting success!')
})
.catch(err => console.log(err))
