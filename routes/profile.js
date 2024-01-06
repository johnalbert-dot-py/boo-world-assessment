'use strict';

const express = require('express');
const router = express.Router();
const { getProfile, createProfile } = require('../services/profile.service');

// const profiles = [
//   {
//     "id": 1,
//     "name": "A Martinez",
//     "description": "Adolph Larrue Martinez III.",
//     "mbti": "ISFJ",
//     "enneagram": "9w3",
//     "variant": "sp/so",
//     "tritype": 725,
//     "socionics": "SEE",
//     "sloan": "RCOEN",
//     "psyche": "FEVL",
//     "image": "https://soulverse.boo.world/images/1.png",
//   }
// ];


module.exports = function() {


  router.get('/:profile', async function(req, res, next) {

    const profile = await getProfile(req.params.profile ?? '');
    res.render('profile_template', {
      profile: profile ?? {},
    });

  });

  router.post("/", async function(req, res, next) {

    const profile = req.body;
    const newProfile = await createProfile(profile);
    res.json({
      success: !!newProfile._id,
      profile: newProfile
    });

  })

  return router;
}

