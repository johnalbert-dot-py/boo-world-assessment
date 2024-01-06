"use strict"

const mongoose = require('mongoose');
const { getUser } = require('../services/user.service')
const { getProfile } = require('../services/profile.service');

/*

Create a schema for the Vote model.

It should look like this:

{
  profile: ProfileId && Required,
  mbti: Optional,
  ennagram: Optional,
  zodiac: Optional,
  title: String && Required,
  comment: String && Required,
  by: UserId && Required,
  likes: UserId[]
  createdAt: Date && Required,
  updatedAt: Date && Required,
}

*/

const VoteSchema = new mongoose.Schema({
  profile: {
    type: String,
    ref: 'Profile',
    required: true,
    validate: {
      validator: async function(v) {
        const profile = await getProfile(v)
        return profile?._id ? true : false
      },
      message: 'Profile does not exist'
    }
  },
  mbti: {
    type: String,
    enum: [
      'INFP',
      'INFJ',
      'ENFP',
      'ENFJ',
      'INTJ',
      'INTP',
      'ENTP',
      'ENTJ',
      'ISFP',
      'ISFJ',
      'ESFP',
      'ESFJ',
      'ISTP',
      'ISTJ',
      'ESTP',
      'ESTJ'
    ]
  },
  enneagram: {
    type: String,
    enum: [
      '1w2',
      '2w3',
      '3w2',
      '3w4',
      '4w3',
      '4w5',
      '5w4',
      '5w6',
      '6w5',
      '6w7',
      '7w6',
      '7w8',
      '8w7',
      '8w9',
      '9w8',
      '9w1'
    ]
  },
  zodiac: {
    type: String,
    enum: [
      'aries',
      'taurus',
      'gemini',
      'cancer',
      'leo',
      'virgo',
      'libra',
      'scorpio',
      'sagittarius',
      'capricorn',
      'aquarius',
      'pisces'
    ]
  },
  title: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  by: {
    type: String,
    ref: 'User',  
    required: true,
    validate: {
      validator: async function(v) {
        const user = await getUser(v)
        return user?._id ? true : false
      },
      message: 'User does not exist'
    }
  },
  likes: [{
    type: String,
    ref: 'User',
    required: true,
    validate: {
      validator: async function(v) {
        const user = await getUser(v)
        return user?._id ? true : false
      },
      message: 'User does not exist'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
})


// create a middleware to check if User is existing 
VoteSchema.pre('save', async function(next) {
  
  const by = await getUser(this.by)
  this.by = by._id

  const profile = await getProfile(this.profile)
  this.profile = profile._id

  next();

})

const Vote = mongoose.model('Vote', VoteSchema);

module.exports = Vote;
