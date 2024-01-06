"use strict"

const mongoose = require('mongoose');
const slugify = require('slugify')

/* 

Create a schema for the Profile model.

{  
  "id": 1,
  "name": "A Martinez",
  "description": "Adolph Larrue Martinez III.",
  "mbti": "ISFJ",
  "enneagram": "9w3",
  "variant": "sp/so",
  "tritype": 725,
  "socionics": "SEE",
  "sloan": "RCOEN",
  "psyche": "FEVL",
  "image": "https://soulverse.boo.world/images/1.png",
}

*/

const ProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  mbti: {
    type: String,
    required: true,
  },
  enneagram: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    required: true,
  },
  tritype: {
    type: String,
    required: true,
  },
  socionics: {
    type: String,
    required: true,
  },
  sloan: {
    type: String,
    required: true,
  },
  psyche: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "https://pngimg.com/uploads/elon_musk/elon_musk_PNG21.png"
  },
  slug: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Create a slug from the name field

ProfileSchema.pre('save', async function(next) {
  let slug = slugify(this.name, { lower: true });
  let profile = await this.constructor.findOne({ slug });
  let counter = 0;

  // If the slug already exists, append a number to it and increment the number until a unique slug is found
  while (profile) {
    counter++;
    slug = `${slugify(this.name, { lower: true })}-${counter}`;
    profile = await this.constructor.findOne({ slug });
  }

  this.slug = slug;
  next();
});

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;
