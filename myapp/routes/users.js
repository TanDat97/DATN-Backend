const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
          });
          user
          .save()
          .then(result => {
            res.status(201).json({
              status: 201,
              message: 'user created',
              username: result.email,
              id: result._id,
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
      console.log(user[0])
      if (result) {
        const token = jwt.sign({
          id: user[0]._id,
          email: user[0].email,
          fullname: user[0].fullname,
          address: user[0].address,
          email: user[0].email,
          phone: user[0].phone,
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

router.delete('/:userID', (req, res, next) => {
  User.remove({
    _id: req.params.userID
  })
  .exec()
  .then(result => {
    res.status(200).json({
      status: 200,
      message: 'user deleted',
      result: result
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

module.exports = router;
