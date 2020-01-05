const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const bcrypt = require('bcryptjs');

// User Schema
const UserSchema = mongoose.Schema({
	email: {
		type: String,
		require: true,
		unique: true
	},
	password: {
		type: String,
		require: true,
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