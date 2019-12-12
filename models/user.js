const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// User Schema
const UserSchema = new mongoose.Schema({
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
})

module.exports = mongoose.model('Users', UserSchema)


module.exports.createUser = (newUser, callback)
	=> bcrypt.genSalt(10, (err, salt)
		=> bcrypt.hash(newUser.password, salt, (err, hash)
			=> {
	newUser.password = hash;
	newUser.save(callback);
	return;
}))