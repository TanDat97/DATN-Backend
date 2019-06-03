const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const cloudinary = require('cloudinary')

const checkAuth = require('../middleware/checkAuth')
const libFunction = require('../lib/function')
const Project = require('../models/projectModel')
const Comment = require('../models/commentModel')

const numItem = require('../lib/constant')

cloudinary.config({
    cloud_name: 'dne3aha8f',
    api_key: '464146278492844',
    api_secret: 'JdBsEVQDxp4_1jsZrT-qM7T8tns'
})
router.get('/all/:page', (req, res, next) => {
    const page = parseInt(req.params.page) - 1
    Project.find({
        verify: true,
        $or: [{statusProject: 1},{statusProject: 3}],
    }).sort({ 'createTime': -1 }).skip(page*numItem).limit(numItem)
        .select('_id url publicId codelist name investor price unit area address type info lat long ownerid fullname phone email avatar statusProject amount createTime updateTime verify allowComment __v')
        .exec()
        .then(results => {
            if (results.length > 0) {
                res.status(200).json({
                    status: 200,
                    count: results.length,
                    page: page + 1,
                    projects: results,
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

router.post('/home', (req, res, next) => {
    Project.find({
        verify: true,
        $or: [{statusProject: 1},{statusProject: 3}],
    })
        .select('_id url publicId codelist name investor price unit area address type info lat long ownerid fullname phone email avatar statusProject amount createTime updateTime verify allowComment __v')
        .exec()
        .then(temp => {
            const results = libFunction.distanceListPlace(temp, req.body.radius, req.body.lat, req.body.long)
            if (results.length > 0) {
                res.status(200).json({
                    status: 200,
                    count: results.length,
                    projects: results,
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

router.post('/searchmap', (req, res, next) => {
    const typeParam = req.body.type
    const statusParam = req.body.statusProject
    const areaParam = libFunction.convertData(req.body.area)
    const priceParam = libFunction.convertData(req.body.price)

    Project.find({
        verify: true,
        type: typeParam == '0' ? { $gte: 1, $lte: 4 } : typeParam,
        statusProject: statusParam,
        area: { $gte: areaParam.start, $lte: areaParam.end },
        price: { $gte: priceParam.start, $lte: priceParam.end },
    })
        .select('_id url publicId codelist name investor price unit area address type info lat long ownerid fullname phone email avatar statusProject amount createTime updateTime verify allowComment __v')
        .exec()
        .then(temp => {
            const results = libFunction.distanceListPlace(temp, req.body.radius, req.body.lat, req.body.long)
            if (results.length > 0) {
                res.status(200).json({
                    status: 200,
                    message: 'get list project success',
                    count: results.length,
                    projects: results,
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

router.get('/:id', (req, res, next) => {
    const id = req.params.id
    Project.findById(id)
        .select('_id url publicId codelist name investor price unit area address type info lat long ownerid fullname phone email avatar statusProject amount createTime updateTime verify allowComment __v')
        .exec()
        .then(result => {
            if (result != null) {
                res.status(200).json({
                    status: 200,
                    message: 'get info project success',
                    project: result,
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

router.post('/', checkAuth, (req, res, next) => {
    const codelist = req.body.codelist ? req.body.codelist : ['dummy']
    const project = new Project({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        investor: req.body.investor,
        price: req.body.price,
        unit: req.body.unit,
        area: req.body.area,
        address: req.body.address,
        type: req.body.type,
        info: req.body.info,
        lat: req.body.lat,
        long: req.body.long,
        ownerid: req.userData.id,
        fullname: req.body.fullname,
        phone: req.body.phone,
        email: req.body.email,
        avatar: req.body.avatar,
        statusProject: req.body.statusProject,
        amount: codelist.length,
        createTime: req.body.createTime,
        updateTime: req.body.updateTime,
        verify: false,
        allowComment: true,
        codelist: libFunction.createCodeList(codelist),
        url: req.body.url,
        publicId: req.body.publicId,
    })
    User.find({
        id: req.userData.id,
        verify: true,
    })
    .exec()
    .then(result => {
        if(result.statusAccount === 1 && totalProject >= 5) {
            res.status(203).json({
                status: 203,
                message: 'your account has maximum 5 project, upgrade your account for more',
            })
        } else if(result.statusAccount === 2 && totalProject  >= 40) {
            res.status(204).json({
                status: 204,
                message: 'your account has maximum 40 project',
            })
        } else {
            project
            .save()
            .then(result => {
                // update totalProject
                res.status(201).json({
                    status: 201,
                    message: 'add project success',
                    project: result,
                })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    status: 500,
                    error: err,
                })
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            status: 500,
            error: err,
        })
    })

})


const compare = function (arr1, arr2) {
    const finalarray = []
    var flag = false
    for (i = 0; i < arr1.length; i++) {
        flag = false
        for (j = 0; j < arr2.length; j++) {
            if (arr1[i] === arr2[j]) {
                flag = true
                break
            }
        }
        if (flag == false) {
            finalarray.push(arr1[i])
        }
    }
    return finalarray
}
router.post('/edit/:id', checkAuth, (req, res, next) => {
    const id = req.params.id
    const name = req.body.name
    const investor = req.body.investor
    const price = req.body.price
    const unit = req.body.unit
    const area = req.body.area
    const address = req.body.address
    const type = req.body.type
    const info = req.body.info
    const lat = req.body.lat
    const long = req.body.long
    const ownerid = req.userData.id
    const fullname = req.body.fullname
    const phone = req.body.phone
    const email = req.body.email
    const avatar = req.body.avatar
    const updateTime = req.body.updateTime
    const url = req.body.url
    const publicId = req.body.publicId

    Project.find({
        _id: id,
        ownerid: req.userData.id,
        verify: true,
        $or: [{statusProject: 1},{statusProject: 3}],
    })
        .exec()
        .then(doc => {
            if (doc.length > 0) {
                // console.log(typeof (publicId))
                publicIdInDataBase = doc[0].publicId
                // console.log(typeof (publicIdInDataBase))
                publicIdDelete = compare(publicIdInDataBase, publicId)
                // console.log(publicIdDelete)
                if (publicIdDelete.length > 0) {
                    cloudinary.v2.api.delete_resources(publicIdDelete, { invalidate: true },
                        function (error, result) { console.log(result) })
                }
            }
        })

    Project.update({
        _id: id,
        ownerid: req.userData.id
    }, {
            $set: {
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
                fullname: fullname,
                phone: phone,
                email: email,
                avatar: avatar,
                updateTime: updateTime,
                url: url,
                publicId: publicId,
            }
        })
        .exec()
        .then(result => {
            if (result.nModified > 0) {
                res.status(200).json({
                    status: 200,
                    message: 'update project success',
                    project: {
                        _id: id,
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
                        updateTime: updateTime,
                        url: url,
                        publicId: publicId,
                    },
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

router.delete('/:id', checkAuth, (req, res, next) => {
    const projectid = req.params.id
    Project.remove({
        _id: projectid,
        ownerid: req.userData.id,
    })
        .exec()
        .then(result => {
            if (result.n > 0) {
                Comment.remove({ projectid: projectid }).exec().then(result => console.log('delete comment success'))
                // delete transaction 
                // delete detailtransacion
                // delete request
                // update totalProject
                res.status(200).json({
                    status: 200,
                    message: 'delete project success',
                    request: {
                        type: 'DELETE',
                    }
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


router.post('/searchprojects', (req, res, next) => {
    const typeParam = req.body.type
    const statusParam = req.body.statusProject
    const addressParam = req.body.address
    const areaParam = libFunction.convertData(req.body.area)
    const priceParam = libFunction.convertData(req.body.price)
    Project.find({
        verify: true,
        type: typeParam == '0' ? { $gte: 1, $lte: 4 } : typeParam,
        statusProject: statusParam,
        area: { $gte: areaParam.start, $lte: areaParam.end },
        price: { $gte: priceParam.start, $lte: priceParam.end },
        address: { $regex: `.*${addressParam}.*` },
    })
        .select('_id url publicId codelist name investor price unit area address type info lat long ownerid fullname phone email avatar statusProject amount createTime updateTime verify allowComment __v')
        .exec()
        .then(results => {
            if (results.length >= 0) {
                res.status(200).json({
                    status: 200,
                    count: results.length,
                    projects: results,
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

router.post('/searchaddress', (req, res, next) => {
    const addressParam = req.body.address
    const areaParam = libFunction.convertData(req.body.area)
    const priceParam = libFunction.convertData(req.body.price)
    Project.find({
        verify: true,
        $or: [{statusProject: 1},{statusProject: 3}],
        area: { $gte: areaParam.start, $lte: areaParam.end },
        price: { $gte: priceParam.start, $lte: priceParam.end },
        address: { $regex: `.*${addressParam}.*` },
    })
        .select('_id url publicId codelist name investor price unit area address type info lat long ownerid fullname phone email avatar statusProject amount createTime updateTime verify allowComment __v')
        .exec()
        .then(results => {
            if (results.length >= 0) {
                res.status(200).json({
                    status: 200,
                    count: results.length,
                    projects: results,
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

router.post('/deleteImages', (req, res, next) => {
    console.log(req.body)
    publicId = req.body.publicId
    console.log(publicId)
    cloudinary.v2.uploader.destroy(publicId,
        function (error, result) { console.log(result, error) })
})

module.exports = router
