'use strict';

const express = require('express');
const router = express.Router();
const { createUser } = require('../services/user.service')

module.exports = function() {

  router.post('/', async function(req, res, next) {

    const user = req.body;
    const newUser = await createUser(user);
    res.json({
      success: !!newUser._id,
      user: newUser
    })

  });

  return router;
}

