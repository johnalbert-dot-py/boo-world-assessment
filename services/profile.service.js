"use strict";

const {	isValidObjectId } = require('mongoose');
const Profile = require('../models/Profile.model');


async function getProfile(profile) {
	try {

		return isValidObjectId(profile) ?
			await Profile.findById(profile).exec() : 
			await Profile.findOne({
				slug: profile
			}).exec();

	} catch (error) {
		console.error(error);
		return {}
	}
}

async function createProfile(profile) {
	const newProfile = new Profile(profile);
	try {
		return await newProfile.save();
	} catch (error) {
		console.error(error);
		return error
	}
}

module.exports = {
	getProfile,
  createProfile,
}