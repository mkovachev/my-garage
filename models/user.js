const mongoose = require('mongoose');
//mongoose.set('useCreateIndex', true);

const UserSchema = new mongoose.Schema({
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

module.exports = mongoose.model('User', UserSchema)