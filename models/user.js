const mongoose = require('mongoose');
<<<<<<< HEAD
mongoose.set('useCreateIndex', true);
=======
>>>>>>> bc3979e4adcb63e98f6cba282648a38ff2b2a3b8
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

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

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function (newUser, callback) {
	bcrypt.genSalt(10, function (err, salt) {
		bcrypt.hash(newUser.password, salt, function (err, hash) {
			newUser.password = hash;
			newUser.save(callback);
			return;
		});
	});
}