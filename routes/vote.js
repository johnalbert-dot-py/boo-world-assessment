'use strict';

const express = require('express');
const router = express.Router();
const { createVote, getProfileVotes, createLike, removeLike, getVote } = require('../services/vote.service')

module.exports = function() {


  router.get('/:profile', async function(req, res, next) {

    const profile = req.params.profile;
    const filter = req.query.filter ?? "all";
    const sort = req.query.sort ?? "best";
    
    const votes = await getProfileVotes(profile, filter, sort);

    if (votes === null) {
      res.status(404).send('Profile not found');
    }

    res.json({
      success: true,
      votes: votes
    })

  });

  router.post('/:profile', async function(req, res, next) {

    const profile = req.params.profile;
    const vote = req.body;

    const newVote = await createVote(profile, vote);
    res.json({
      success: !!newVote._id,
      vote: newVote
    })

  });

  router.post('/:vote_id/:action(like|dislike)?', async function(req, res, next) {
      
      const voteId = req.params.vote_id;
      const action = req.params.action;

      const by = req.body.by;

      const vote = await getVote(voteId);

      if (!vote?._id) {
        res.status(404).json({ message: 'Vote not found' });
        return;
      }

      let result;

      if (action === "like") {
        result = await createLike(vote._id, by);
      } else if (action === "dislike") {
        result = await removeLike(vote._id, by);
      } else {
        res.status(404).json({ message: 'Invalid Action' });
        return
      }

      if (result === null) {
        res.status(404).json({ message: 'User not found' });
        return
      }

      res.json({
        success: !!result?._id,
        result: result
      })

  })

  return router;
}

