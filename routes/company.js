const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const checkAuthCompany = require('../middleware/checkAuthCompany');
const libFunction = require('../lib/function');
const Company = require('../models/companyModel');
const User = require('../models/userModel');
const Project = require('../models/projectModel');

var transporter = nodemailer.createTransport({ // config mail server
    service: 'Gmail',
    auth: {
        user: 'trandat.sgg@gmail.com',
        pass: 'datdeptrai',
    }
});

router.post('/verifycompany', (req, res, next) => {
    const id = req.body.id
    const hash = req.body.hash
    Company.update({
        _id: id,
        hash: hash,
        verify: false,
    }, {
        $set: {
            verify: true,
        }
    })
    .exec()
    .then(result => {
        if (result.nModified > 0) {
            res.status(200).json({
                status: 200,
                message: 'verify company account success, please login',
            });
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
        });
    });
})

router.post('/resetpassword', (req, res, next) => {
    const email = req.body.email
    Company.find({
        email: email,
        verify: true,
    })
    .exec()
    .then(company=>{
        if (company.length <= 0) {
            return res.status(404).json({
                status: 404,
                message: 'your account does not exists',
            });
        } else {
            const pass = libFunction.randomPassword(10)
            bcrypt.hash(pass, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        status: 500,
                        error: err,
                    });
                } else {
                    var EmailCompanyModel = require('../lib/emailCompanyModel')
                    var emailModel = new EmailCompanyModel()
                    emailModel.resetMail(email, pass)
                    Company.update({
                        email: email
                    }, {
                        $set: {
                            password: hash,
                        }
                    })
                    .then(result => {
                        if (result.nModified > 0) {
                            transporter.sendMail(emailModel.mail, function (err, info) {
                                if (err) {
                                    console.log('send email error ' + err)
                                    res.status(500).json({
                                        status: 500,
                                        message: 'send email error',
                                        error: err,
                                    })
                                } else {
                                    res.status(200).json({
                                        status: 200,
                                        message: 'mail reset password has send, check your email to get new password',
                                        email: email,
                                    })
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
                        console.log(err);
                        res.status(500).json({
                            status: 500,
                            error: err
                        })
                    });              
                }
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            status: 500,
            error: err
        });
    })
})

router.post('/changepassword', checkAuthCompany, (req, res, next) => {
    Company.find({
        email: req.companyData.email,
        _id: req.companyData.id,
        verify: true,
    })
    .exec()
    .then(company => {
        if (company.length <= 0) {
            return res.status(401).json({
                status: 401,
                message: 'Account not found'
            });
        }
        bcrypt.compare(req.body.currentPassword, company[0].password, (err, result) => {
            if (err) {
                return res.status(40).json({
                    status: 401,
                    message: 'Change password failed 1',
                });
            }
            if (result) {
                bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            status: 500,
                            error: err,
                        });
                    } else {
                        Company.update({
                            email: req.companyData.email,
                            _id: req.companyData.id,
                        }, {
                            $set: {
                                password: hash
                            }
                        })
                        .exec()
                        .then(result => {
                            if (result.nModified > 0) {
                                res.status(200).json({
                                    status: 200,
                                    message: 'Change password success',
                                    email: req.companyData.email,
                                    _id: req.companyData.id,
                                });
                            } else {
                                res.status(404).json({
                                    status: 404,
                                    message: 'Change password failed 2'
                                })
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                status: 500,
                                error: err,
                                message: 'Change password failed 3',
                            });
                        });     
                    }
                }) 
            } else {
                return res.status(401).json({
                    status: 401,
                    message: 'Change password failed 4',
                });
            }
        });
    })
    .catch(err => {
        console.log(err);
        return res.status(401).json({
            status: 401,
            error: err,
            message: 'Change password failed 5',
        });
    });
});

router.post('/login', (req, res, next) => {
    Company.find({
        email: req.body.email,
        verify: true,
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
                companyname: result.companyname,
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
        email: email,
        verify: true,
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

router.post('/addemployee', checkAuthCompany, (req, res, next) => {
    User.find({
        email: req.body.email,
    })
    .exec()
    .then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
                status: 409,
                message: 'user exists',
            })
        } else {
            const pass = libFunction.randomPassword(10)
            bcrypt.hash(pass, 10, (err, hash) => {
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
                        phone: req.body.phone,
                        description: req.body.description,
                        email: req.body.email,
                        totalProject: 0,
                        statusAccount: 1,
                        avatar: req.body.avatar,
                        company: req.companyData.id,
                        lock: false,
                        verify: false,
                        hash: 0,

                    });
                    const employeeTemp = {
                        employee: user._id,
                        createTime: req.body.createTime
                    }
                    user.hash = libFunction.hashString(user._id.toString())
                    var link = "http://localhost:3000/verifyemployee/" + user.company + "/" + user._id + "/" + user.hash;
                    var EmailEmployeeModel = require('../lib/emailEmployeeModel')
                    var emailModel = new EmailEmployeeModel()
                    emailModel.verifyMail(user.email, link, pass)
                    user
                    .save()
                    .then(result => {
                        Company.findOneAndUpdate({ _id: req.companyData.id }, { $push: { employees: employeeTemp }})
                        .exec()
                        .then(resultUpdate => {
                            transporter.sendMail(emailModel.mail, function (err, info) {
                                if (err) {
                                    console.log('send email error ' + err)
                                    res.status(500).json({
                                        status: 500,
                                        message: 'send email error',
                                        employee: user,
                                        error: err,
                                    })
                                } else {
                                    res.status(201).json({
                                        status: 201,
                                        message: 'employee created in company',
                                        employee: user,
                                        info: info.response,
                                    }) 
                                }
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

router.post('/deleteemployee', checkAuthCompany, (req, res, next) => {
    const id = req.body.id
    Company.find({
        _id: req.companyData.id,
        email: req.companyData.email,
        verify: true,
    })
    .exec()
    .then(datacompany => {
        if (datacompany.length > 0) {
            const found = datacompany[0].employees.some(element => {
                return element.employee === id;
            });
            if (found === true) {
                Company.findOneAndUpdate({ _id: req.companyData.id }, { $pull: { employees: { employee: id }}})
                .exec()
                .then(
                    User.findByIdAndRemove({
                        _id: id
                    })
                    .exec()
                    .then(
                        res.status(200).json({
                            status: 200,
                            message: 'employee has been deleted',
                        })
                    )
                )
            } else {
                res.status(404).json({
                    status: 404,
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

router.post('/editemployee', checkAuthCompany, (req, res, next) => {
    const id = req.body.id;
    const email= req.body.email;
    const fullname = req.body.fullname;
    const address = req.body.address;
    const phone = req.body.phone;
    const totalProject = req.body.totalProject;
    const statusAccount = req.body.statusAccount;
    const avatar = req.body.avatar;
    const description = req.body.description;
    User.updateMany({
        _id: id,
        email: email,
    },{
        $set :{
            fullname: fullname,
            address: address,
            phone: phone,
            totalProject: totalProject,
            statusAccount: statusAccount,
            avatar: avatar,
            description: description,
        }
    })
    .exec()
    .then(result => {
        if(result.nModified > 0){
            res.status(200).json({
                status:200,
                message:'update employee success'
            });
        } else {
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

router.post('/changeLockEmployee', checkAuthCompany, (req, res, next) => {
    User.update({
        _id: req.body.id,
    }, {
        $set: {
            lock: req.body.lock,
        }
    })
    .exec()
    .then(result => {
        if (result.nModified > 0) {
            res.status(200).json({
                status: 200,
                message: 'change account state success',
                lock: req.body.lock,
            });
        } else {
            res.status(404).json({
                status: 404,
                message: 'No valid entry found'
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            status: 500,
            error: err
        });
    });
})

module.exports = router;