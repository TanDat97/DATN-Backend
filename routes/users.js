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

var { generateToken, sendToken } = require('./../middleware/token.utils');
var passport = require('passport');
var config = require('./../middleware/config');
var request = require('request');
require('./../middleware/passport')();

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
            address: req.body.address,
            email: req.body.email,
            phone: req.body.phone,
            description: req.body.description,
            totalProject: 0,
            statusAccount: 0,
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
            });
          });
        }
      });
    }
  })
  .catch();
});

router.post('/login', (req, res, next) => {
  User.find({
    email: req.body.email
  })
  .exec()
  .then(user => {
    if (user.length < 0) {
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
          address: user[0].address,
          phone: user[0].phone,
          totalProject: user[0].totalProject,
          statusAccount: user[0].statusAccount,
        }, 'shhhhh', {
            expiresIn: "5h"
          });
        return res.status(200).json({
          status: 200,
          message: 'successful',
          id: user[0]._id,
          email: user[0].email,
          fullname: user[0].fullname,
          address: user[0].address,
          description: user[0].description,
          totalProject: user[0].totalProject,
          statusAccount: user[0].statusAccount,
          token: token,
        })
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
      message: 'successful',
      id: result._id,
      email: result.email,
      fullname: result.fullname,
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
    });
  });
});

router.post('/edit', checkAuth, (req, res, next) => {
  const id = req.userData.id;
  const fullname = req.body.fullname;
  const address = req.body.address;
  const phone = req.body.phone;
  const totalProject = req.body.totalProject;
  const statusAccount = req.body.statusAccount;
  const avatar = req.body.avatar;
  const description = req.body.description;

  User.update({
    _id: id,
    email: req.userData.email,
  }, {
    $set: {
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
    if (result.nModified > 0) {
      res.status(200).json({
        status: 200,
        message: 'update user success',
        user: {
          _id: id,
          email: email,
          fullname: fullname,
          address: address,
          phone: phone,
          totalProject: totalProject,
          statusAccount: statusAccount,
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
    });
  });
});

router.get('/listSaved', checkAuth, (req, res, next) => {
  SavedProject.find({
    userid: req.userData.id,
  })
  .populate({path:'projects.project'})
  .then(result => {
    if (result.length > 0) {
      res.status(200).json({
        status: 200,
        message: 'success',
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
    const isInArray = result[0].projects.some(temp => {
      return temp.project === req.body.projectid;
    })
    if (result.length >= 1 && isInArray) {
      return res.status(409).json({
        status: 409,
        message: 'user has followed this project',
      })
    } else if (result.length >= 1 && !isInArray) {
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
    });
  });
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
    });
  });
})

router.post('/auth/google', passport.authenticate('google-token', { session: false }), function (req, res, next) {
  if (!req.user) {
    return res.send(401, 'User Not Authenticated');
  }
  req.auth = {
    id: req.user.id
  };

  next();
}, generateToken, sendToken);

module.exports = router;
