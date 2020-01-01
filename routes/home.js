const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('../models/user');
const Vehicle = require('../models/vehicle');
const Event = require('../models/event');
const authGuard = require('../middleware/authGuard')


// home
router.get('/', function (req, res) {
	res.render('home')
})

// logout
router.get('/logout', authGuard.isLoggedOut, function (req, res) {
	res.render('home');
});

// mygarage - all vehicles per user view
router.get('/mygarage', authGuard.isLoggedIn, function (req, res, next) {
	const id = req.session.user._id;
	Vehicle.find({
		"owner": id
	}, function (err, vehicles) {
		if (err) {
			res.render('mygarage', {
				errors: err
			});
		} else if (vehicles.length === 0) {
			req.flash('error_msg', 'You have no vehicles, add one now'); // TODO
			res.redirect('addvehicle');
		} else {
			res.render('mygarage', {
				layout: false,
				vehicles: vehicles,
				helpers: {
					json: function (context) {
						return JSON.stringify(context);
					}
				}
			});
			return;
		}
	})
});

//--------------------POST requests --------------


// register
router.post('/', function (req, res) {
	const username = req.body.username;
	const email = req.body.email;
	const password = req.body.password;
	const password2 = req.body.password2;

	// input validation
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	const errors = req.validationErrors();

	User.findOne({
		"username": username,
		"email": email
	}).then(user => {
		if (user) {
			res.redirect('/');
		} else {
			if (errors) {
				res.render('home', {
					errors: errors
				});
			} else {
				const newUser = new User({
					email: email,
					username: username,
					password: password
				});
				User.createUser(newUser, function (err, user) {
					if (err) throw err;
					console.log(user);
				});
				res.redirect('/');
			}
		}
	});
	return;
});

// Login
router.post('/mygarage', function (req, res) {
	const loginParams = req.body;
	const username = req.body.username;
	const password = req.body.password;

	req.checkBody('username', 'username is required').notEmpty();
	req.checkBody('password', 'password is required').notEmpty();

	const errors = req.validationErrors();

	if (errors) {
		res.render('home', {
			errors: errors
		});
	} else {
		User.findOne({
			"username": loginParams.username
		}, function (err, user) {
			if (err) {
				res.redirect('/');
			}
			if (!user || user === null) {
				res.render('home', {
					errors: "User not found"
				});
			}

			bcrypt.compare(loginParams.password, user.password, function (err, success) {
				if (err) {
					res.redirect('/');
				}

				if (success) {
					req.session.user = user;
					req.flash('success_msg', 'You are logged in');
					res.redirect('/mygarage');
				}
			});
		});
	}
});

module.exports = router