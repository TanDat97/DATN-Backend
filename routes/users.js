const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const checkAuth = require('../middleware/checkAuth');
const libFunction = require('../lib/function');
const User = require('../models/userModel');
const Project = require('../models/projectModel');
const SavedProject = require('../models/savedProjectModel');

var request = require('request');
var passport = require('passport');
var { generateToken, sendToken } = require('./../middleware/token.utils');
var config = require('./../middleware/config');
require('./../middleware/passport')();

const numItem = 30

router.post('/signup', (req, res, next) => {
  User.find({
    email: req.body.email,
  })
  .exec()
  .then(user => {
    if (user.length >= 1) {
      return res.status(409).json({
        status: 409,
        message: 'user exists',
      });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            status: 500,
            error: err,
          });
        } else {
          const user = User({
            _id: new mongoose.Types.ObjectId(),
            password: hash,
            fullname: req.body.fullname,
            identify: req.body.identify,
            address: req.body.address,
            phone: req.body.phone,
            description: req.body.description,
            email: req.body.email,
            totalProject: 0,
            statusAccount: 1,
            avatar: 'ssssssssssss',
            company: '0',
            lock: false,
            verify: true,
          });
          user
          .save()
          .then(result => {
            res.status(201).json({
              status: 201,
              message: 'user created',
              email: result.email,
              // id: result._id,
            })
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              status: 500,
              error: err
            })
          })
        }
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

router.get('/allagent/:page', (req, res, next) => {
  const page = parseInt(req.params.page) - 1
  User.find({
    verify: true,
    lock: false,
    $or: [{statusAccount: 2}]
  }).skip(page*numItem).limit(numItem)
  .select('_id email fullname identify address phone description totalProject statusAccount avatar company')
  .exec()
  .then(result => {
      res.status(200).json({
          status: 200,
          message: 'get all agent successful',
          page: page + 1,
          count: result.length,
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
router.get('/infoagent/:id/:page', (req, res, next) => {
  const id = req.params.id
  const page = parseInt(req.params.page) - 1
  User.find({
      _id: id,
      verify: true,
      lock: false,
      $or: [{statusAccount: 2}]
  })
  .select('_id email fullname identify address phone description totalProject statusAccount avatar company')
  .exec()
  .then(result => {
      Project.find({
          ownerid: id,
          verify: true,
      }).sort({ 'createTime': -1 }).skip(page*numItem).limit(numItem)
      .select()
      .exec()
      .then(results => {
          res.status(200).json({
              status: 200,
              message: 'get info agent successful',
              page: page + 1,
              info: result[0],
              projects: results,
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
})

router.post('/login', (req, res, next) => {
  User.find({
    email: req.body.email,
    verify: true,
  })
  .exec()
  .then(user => {
    if (user.length <= 0) {
      return res.status(401).json({
        status: 401,
        message: 'Auth failed email,'
      });
    }
    bcrypt.compare(req.body.password, user[0].password, (err, result) => {
      if (err) {
        return res.status(401).json({
          status: 401,
          message: 'Auth failed password'
        });
      }
      if (result) {
        const token = jwt.sign({
          id: user[0]._id,
          email: user[0].email,
          fullname: user[0].fullname,
          identify: user[0].identify,
          address: user[0].address,
          phone: user[0].phone,
          totalProject: user[0].totalProject,
          statusAccount: user[0].statusAccount,
          }, 'shhhhh', {
            expiresIn: "5h"
        });
        if(user[0].lock === true) {
          return res.status(500).json({
              status: 500,
              message: 'this account user has been locked',
          })
        } else {
          return res.status(200).json({
            status: 200,
            message: 'successful',
            user: user[0],
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

router.get('/info', checkAuth, (req, res, next) => {
  const id = req.userData.id;
  User.findById(id)
  .exec()
  .then(result => {
    res.status(200).json({
      status: 200,
      message: 'get ino account successful',
      id: result._id,
      email: result.email,
      fullname: result.fullname,
      identify: result.identify,
      address: result.address,
      phone: result.phone,
      description: result.description,
      totalProject: result.totalProject,
      statusAccount: result.statusAccount,
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      status: 500,
      error: err
    })
  })
})

router.post('/edit', checkAuth, (req, res, next) => {
  const id = req.userData.id;
  const email= req.userData.email;
  const fullname = req.body.fullname;
  const identify  = req.body.identify;
  const address = req.body.address;
  const phone = req.body.phone;
  const totalProject = req.body.totalProject;
  const avatar = req.body.avatar;
  const description = req.body.description;
  User.updateMany({
    _id: id,
    email: email,
    verify: true,
  }, {
    $set: {
      fullname: fullname,
      identify: identify,
      address: address,
      phone: phone,
      totalProject: totalProject,
      avatar: avatar,
      description: description,
    }
  })
  .exec()
  .then(result => {
    if (result.nModified > 0) {
      res.status(200).json({
        status: 200,
        message: 'update accont user success',
        user: {
          _id: id,
          email: email,
          fullname: fullname,
          address: address,
          phone: phone,
          totalProject: totalProject,
          avatar: avatar,
          description: description,
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

router.get('/danhsachproject', checkAuth, (req, res, next) => {
  Project.find({
    ownerid: req.userData.id
  })
  .select()
  .exec()
  .then(results => {
    if (results.length >= 0) {
      res.status(200).json({
        status: 200,
        message: 'get all project list success',
        count: results.length,
        projects: results,
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
    })
  })
})

router.get('/listSaved', checkAuth, (req, res, next) => {
  SavedProject.find({
    userid: req.userData.id,
  })
  .populate({path:'projects.project'})
  .then(result => {
    if (result.length > 0) {
      res.status(200).json({
        status: 200,
        message: 'get list project saved success',
        count: result[0].projects.length,
        result: result[0],
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

router.post('/follow', checkAuth, (req, res, next) => {
  SavedProject.find({
    userid: req.userData.id,
  })
  .exec()
  .then(result => {
    if(result.length >= 1) {
      if (result[0].requests.length >= 20) {
        return res.status(204).json({
          status: 204,
          message: ' user can not follow more project',
        })
      }
      const isInArray = result[0].projects.some(temp => {
        return temp.project === req.body.projectid;
      })
      if (isInArray) {
        return res.status(409).json({
          status: 409,
          message: 'user has followed this project',
        })
      } else if (!isInArray) {
        const project = {
          project: req.body.projectid,
          createTime: req.body.createTime,
        }
        SavedProject.findOneAndUpdate({userid: req.userData.id}, {$push: {projects: project}})
        .exec()
        .then(ex => {
          res.status(201).json({
            status: 201,
            message: 'add to list saved project success',
            result: project,  
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
    } else {
      const savedproject = new SavedProject({
        _id: new mongoose.Types.ObjectId(),
        userid: req.userData.id,
        fullname: req.body.fullname,
        project:[{
          project: req.body.projectid,
          createTime: req.body.createTime,
        }],
      })
      savedproject
      .save()
      .then(result => {
        res.status(201).json({
          status: 201,
          message: 'create new list saved project success',
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

router.post('/unfollow', checkAuth, (req, res, next) => {
  SavedProject.find({
    userid: req.userData.id,
  })
  .exec()
  .then(result => {
    const isInArray = result[0].projects.some(temp => {
      return temp.project === req.body.projectid;
    })
    if (result.length >= 1 && isInArray) {
      SavedProject.findOneAndUpdate({userid: req.userData.id}, {$pull: {projects: {project: req.body.projectid}}})
      .exec()
      .then(ex => {
        res.status(201).json({
          status: 201,
          message: 'delete from list saved project success',
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

router.post('/auth/google', passport.authenticate('google-token', { session: false }), function (req, res, next) {
  if (!req.user) {
    return res.send(401, 'User Not Authenticated');
  }
  req.auth = {
    id: req.user.id,
    email: req.user.email
  };

  next();
}, generateToken, sendToken);

module.exports = router;
