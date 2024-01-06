"use strict";

const Vote = require('../models/Vote.model');
const { getProfile } = require('./profile.service');
const { getUser } = require('./user.service');

async function createVote(profileId, vote) {

  // we need to make sure that the profile is set
  vote.profile = profileId;

  delete vote.likes;

  const newVote = new Vote(vote);
  try {
    return await newVote.save();
  } catch (error) {
    return error
  }
}

async function getVote(voteId) {
  try {
    return await Vote.findById(voteId).exec();
  } catch (error) {
    console.error(error);
    return error
  }
}

async function getProfileVotes(profile, filter = 'all', sort = 'best') {
  try {

    const profileId = await getProfile(profile);

    if (!profileId) return null;

    return await Vote.find({
      profile: profileId?._id,

      ...(filter === 'all' ? {} : {
        
        ...(filter === 'mbti' ? {
          mbti: {
            $ne: null
          }
        } : {}),

        ...(filter === 'enneagram' ? {
          enneagram: {
            $ne: null
          }
        } : {}),

        ...(filter === 'zodiac' ? {
          zodiac: {
            $ne: null
          }
        } : {})

      }),
    }, null, {
      sort: {
        ...(sort === 'best' ? {
          likes: "desc"
        } : {}),

        ...(sort === 'recent' ? {
          createdAt: "desc"
        } : {}),
      }
    }).exec();

  } catch (error) {
    console.error(error);
    return error
  }
}

async function createLike(voteId, by) {
  try {

    const byUser = await getUser(by);

    if (!byUser) return null;

    return await Vote.findByIdAndUpdate(voteId, {
      $addToSet: {
        likes: byUser._id
      }
    }, {
      new: true
    }).exec();
  } catch (error) {
    console.error(error);
    return error
  }

}

async function removeLike(voteId, by) {
  try {
    const byUser = await getUser(by);

    if (!byUser) return null;

    return await Vote.findOneAndUpdate({
      _id: voteId
    }, {
      $pull: {
        likes: byUser._id
      }
    }, {
      new: true
    }).exec();

  } catch (error) {
    console.error(error);
    return error
  }
}


module.exports = {
  createVote,
  getVote,
  getProfileVotes,
  createLike,
  removeLike
}