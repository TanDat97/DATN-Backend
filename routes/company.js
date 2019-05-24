const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const checkAuthCompany = require('../middleware/checkAuthCompany');
const libFunction = require('../lib/function');
const Company = require('../models/companyModel');
const User = require('../models/userModel');
const Project = require('../models/projectModel');

router.post('/login', (req, res, next) => {
    Company.find({
        email: req.body.email
    })
        .exec()
        .then(company => {
            if (company.length <= 0) {
                return res.status(401).json({
                    status: 401,
                    message: 'Auth failed email,'
                });
            }
            bcrypt.compare(req.body.password, company[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        status: 401,
                        message: 'Auth failed password'
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        id: company[0]._id,
                        email: company[0].email,
                        companyname: company[0].companyname,
                        address: company[0].address,
                        phone: company[0].phone,
                        totalProject: company[0].totalProject,
                        employess: company[0].employess,
                        status: company[0].status,
                    }, 'shhhhh', {
                            expiresIn: "5h"
                        });

                    if(company[0].lock === true) {
                        return res.status(500).json({
                            status: 500,
                            message: 'this account company has been locked',
                        })
                    } else {
                        return res.status(200).json({
                            status: 200,
                            message: 'successful',
                            id: company[0]._id,
                            email: company[0].email,
                            companyname: company[0].companyname,
                            address: company[0].address,
                            totalProject: company[0].totalProject,
                            status: company[0].status,
                            avatar: company[0].avatar,
                            employess: company[0].employess,
                            description: company[0].description,
                            createTime: company[0].createTime,
                            updateTime: company[0].updateTime,
                            verify: company[0].verify,
                            token: token,
                        })
                    }
                }
                return res.status(401).json({
                    status: 401,
                    message: 'Auth failed'
                });
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(401).json({
                status: 401,
                message: 'Auth failed',
                error: err
            });
        });
});

router.get('/info', checkAuthCompany, (req, res, next) => {
    const id = req.companyData.id;
    Company.findById(id)
        .populate({
            path: 'employees.employee'
        })
        .exec()
        .then(result => {
            if(result.lock === true) {
                return res.status(500).json({
                    status: 500,
                    message: 'this account company has been locked',
                })
            } else {
                res.status(200).json({
                    status: 200,
                    message: 'successful',
                    id: result._id,
                    email: result.email,
                    fullname: result.fullname,
                    address: result.address,
                    phone: result.phone,
                    totalProject: result.totalProject,
                    employees: result.employees,
                    status: result.status,
                    avatar: result.avatar,
                    description: result.description,
                    createTime: result.createTime,
                    updateTime: result.updateTime,
                });
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

router.post('/edit', checkAuthCompany, (req, res, next) => {
    const id = req.companyData.id;
    const email = req.companyData.email;
    const companyname = req.body.companyname;
    const address = req.body.address;
    const phone = req.body.phone;
    const totalProject = req.body.totalProject;
    const status = req.body.status;
    const avatar = req.body.avatar;
    const description = req.body.description;
    const createTime = req.body.createTime;
    const updateTime = req.body.updateTime;

    Company.update({
        _id: id,
        email: email
    }, {
            $set: {
                companyname: companyname,
                address: address,
                phone: phone,
                totalProject: totalProject,
                status: status,
                avatar: avatar,
                description: description,
                updateTime: updateTime,
            }
        })
        .exec()
        .then(result => {
            if (result.nModified > 0) {
                res.status(200).json({
                    status: 200,
                    message: 'update company success',
                    user: {
                        _id: id,
                        email: email,
                        companyname: companyname,
                        address: address,
                        phone: phone,
                        totalProject: totalProject,
                        statusAccount: statusAccount,
                        avatar: avatar,
                        description: description,
                        createTime: createTime,
                        updateTime: updateTime,
                    },
                });
            } else {
                res.status(404).json({
                    status: 404,
                    message: 'No valid entry found',
                    result: result,
                });
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
router.post('/addEmployee', checkAuthCompany, (req, res, next) => {
    console.log(req.body.emailEmployee)
    User.find({
        email: req.body.emailEmployee,
    })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    status: 409,
                    message: 'user exists',
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            status: 500,
                            error: err,
                        })
                    } else {
                        const user = User({
                            _id: new mongoose.Types.ObjectId(),
                            password: hash,
                            fullname: req.body.fullname,
                            address: req.body.address,
                            email: req.body.emailEmployee,
                            phone: req.body.phone,
                            description: req.body.description,
                            totalProject: 0,
                            statusAccount: 1,
                            commpany: req.companyData.id
                        });
                        const employeeTemp = {
                            employee: user._id,
                            createTime: req.body.createTime
                        }
                        console.log(employeeTemp)
                        user
                            .save()
                            .then(result => {

                                Company.findOneAndUpdate({
                                    _id: req.companyData.id
                                }, {
                                        $push: {
                                            employees: employeeTemp
                                        }
                                    })
                                    .exec()
                                    .then(resultUpdate => {
                                        res.status(201).json({
                                            status: 201,
                                            message: 'employee created in company',
                                            // email: result.email,
                                            // // id: result._id,
                                        })
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        res.status(500).json({
                                            status: 500,
                                            message: 'Update Company Error',
                                            error: err
                                        });
                                    })
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    status: 500,
                                    message: 'Insert User Error',
                                    error: err
                                });
                            })
                    }
                })
            }
        })
});
router.post('/deleteEmployee', checkAuthCompany, (req, res, next) => {
    console.log(req.body.idEmployee);
    // console.log(req.companyData);
    Company.find({
        _id: req.companyData.id,
        email: req.companyData.email
    })
        .exec()
        .then(datacompany => {
            // console.log(datacompany[0].employees[1])
            if (datacompany.length > 0) {
                const found = datacompany[0].employees.some(element => {
                    return element.employee === req.body.idEmployee;
                });
                console.log(found);
                if (found === true) {
                    Company.findOneAndUpdate({
                        _id: req.companyData.id
                    }, {
                            $pull: {
                                employees: {
                                    employee: req.body.idEmployee
                                }
                            }
                        })
                        .exec()
                        .then(
                            User.findByIdAndRemove({
                                _id: req.body.idEmployee
                            })
                                .exec()
                                .then(
                                    res.status(201).json({
                                        status: 201,
                                        message: 'employee has been deleted',
                                        // email: result.email,
                                        // // id: result._id,
                                    })
                                )

                        )
                } else {
                    res.status(204).json({
                        status: 204,
                        message: 'Employee does not exist'
                    })
                }
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: 500,
                message: 'Delete Employee Error'
            })
        })
});
router.post('/editEmployee', checkAuthCompany, (req, res, next) => {
    console.log(req.body.idEmployee);
    const id = req.body.idEmployee;
    const email= req.body.email;
    const fullname = req.body.fullname;
    const address = req.body.address;
    const phone = req.body.phone;
    const totalProject = req.body.totalProject;
    const statusAccount = req.body.statusAccount;
    const avatar = req.body.avatar;
    const description = req.body.description;
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                error: err,
            })
        }
        else{ const password = hash}
    })

    // console.log(req.companyData);
    User.updateMany({
        _id: id,
    },{$set :{
        email: email,
        fullname: fullname,
        address: address,
        phone: phone,
        totalProject: totalProject,
        statusAccount: statusAccount,
        avatar: avatar,
        description: description,
        password: password,
    }})
        .exec()
        .then(result=>{
            if(result.nModified>0){
                res.status(200).json({
                    status:200,
                    message:'update employee success'
                });
            }
            else{
                res.status(404).json({
                    status:404,
                    message:'No valid entry found'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: 500,
                message: 'Edit Employee Error'
            })
        })
})

module.exports = router;