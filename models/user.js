const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// User Schema
const UserSchema = mongoose.Schema({
	username: {
		type: String,
		require: true,
		unique: true
	},
	password: {
		type: String,
		require: true,
	},
	email: {
		type: String,
		require: true,
		unique: true
	},
	vehicles: [{
		vehicle: {
			type: String,
			ref: 'Vehicle'
		}
	}]
});


module.exports.createUser = function (newUser, callback) {
	bcrypt.genSalt(10, function (err, salt) {
		bcrypt.hash(newUser.password, salt, function (err, hash) {
			newUser.password = hash;
			newUser.save(callback);
			return;
		});
	});
}