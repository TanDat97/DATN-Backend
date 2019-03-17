const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const checkAuth = require('../middleware/check-auth');
const libFunction = require('../lib/function');
const User = require('../models/userModel');
const Project = require('../models/projectModel');

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
              username: req.body.username,
              password: hash,
              fullname: req.body.fullname,
              address: req.body.address,
              email: req.body.email,
              phone: req.body.phone,
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
            username: user[0].username,
            fullname: user[0].fullname,
            address: user[0].address,
            phone: user[0].phone,
            statusAccount: user[0].statusAccount,
          }, 'shhhhh', {
            expiresIn: "1h"
          });
          return res.status(200).json({
            status: 200,
            message: 'successful',
            id: user[0]._id,
            email: user[0].email,
            username: user[0].username,
            fullname: user[0].fullname,
            address: user[0].address,
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

router.get('/info/:id', checkAuth, (req, res, next) => {
  const id = req.params.id;
    User.findById(id)
    .exec()
    .then(result => {
        res.status(200).json({
          status: 200,
          message: 'successful',
          id: result._id,
          email: result.email,
          username: result.username,
          fullname: result.fullname,
          address: result.address,
          phone: result.phone,
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

router.post('/dansachproject/:id', checkAuth, (req, res, next) => {
  Project.find({
      ownerid: req.params.id
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

module.exports = router;
