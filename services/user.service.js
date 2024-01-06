"use strict";

const { isValidObjectId } = require('mongoose');
const User = require('../models/User.model');

async function createUser(user) {
	const newUser = new User(user);
	try {
		return await newUser.save();
	} catch (error) {
		console.error(error);
		return error
	}
}

async function getUser(name) {
	try {

		return isValidObjectId(name) ?
			await User.findById(name).exec() :
			await User.findOne({
				name: name
			}).exec();

	} catch (error) {
		console.error(error);
		return error
	}
}

module.exports = {
  createUser,
	getUser,
}
