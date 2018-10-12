const express = require('express');
const User = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

const secret = 'secret123';

router.post('/signup', (req, res) => {

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      const user = new User({
        email: req.body.email,
        password: hash
      });

      user.save().then((user) => {
        res.status(201).json({
          message: 'User created successfully',
          user: user
        })
      }).catch((err) => {
        res.status(400).json({
          error: err,
          message: 'User already exists'
        });
      });

    });
  });

});

router.post('/login', (req, res) => {
  User.findOne({
    email: req.body.email
  }).then((user) => {
    if(!user) {
      throw new Error('User not found!');
    }

    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if(!result) {
        return res.status(401).send({
          error: 'Invalid password'
        });
      }

      const token = jwt.sign({
        email: user.email,
        id: user._id
      }, secret, { expiresIn: "1h" });

      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: user._id
      });

    });


  }).catch((err) => {
    res.status(401).send({
      error: err.message
    });
  });
});

module.exports = router;

