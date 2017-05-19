const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('../models/user');
const Vehicle = require('../models/vehicle');
const Event = require('../models/event');

// --------------- Routes ---------------------

// home
router.get('/', function (req, res) {
	res.render('home');
});

// add vehicle
router.get('/addvehicle', isLoggedIn, function (req, res) {
	res.render('addvehicle', {
		layout: false
	});
});

// add event
router.get('/addevent', isLoggedIn, function (req, res) {
	res.render('addevent', {
		layout: false
	});
});

// logout
router.get('/logout', isLoggedOut, function (req, res) {
	res.render('home');
});

// helpers
function isLoggedIn(req, res, next) {
	if (req.session.user === null) {
		req.flash('error_msg', 'Please log in!');
		console.log('Please log in!');
		res.redirect('/');
	} else {
		next();
	}
};

function isLoggedOut(req, res, next) {
	if (req.session.user !== null) {
		req.flash('success_msg', 'You are logged out!');
		req.session.destroy(function (err) {
			res.redirect('/');
			res.end("Logout success");
			return;
		});
	} else {
		next();
	}
};

//------------------------- VIEWs ---------------
// maintenance - all events
router.get('/maintenance', isLoggedIn, function (req, res, next) {
	const id = req.session.user._id;
	Event.find({
		"owner": id
	}, function (err, events) {
		if (err) {
			console.log(err);
			req.flash('error_msg', err);
		} else {
			res.render('maintenance', {
				layout: false,
				events: events,
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

// mygarage - all vehicles per user view
router.get('/mygarage', isLoggedIn, function (req, res, next) {
	const id = req.session.user._id;
	Vehicle.find({
		"owner": id
	}, function (err, vehicles) {
		if (err) {
			console.log(err);
			req.flash('error_msg', err);
		} else if (vehicles.length === 0) {
			req.flash('error_msg', 'You have no vehicles, add one');
			console.log('This user has no vehicles, add one first');
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
// add event
router.post('/addevent', isLoggedIn, function (req, res) {
	const inputParams = req.body;
	const title = req.body.title;
	const description = req.body.description;
	const license = req.body.license;
	const cost = req.body.cost;

	const user = req.session.user;

	// input validation
	req.checkBody('title', 'title is required').notEmpty();
	req.checkBody('description', 'description is required').notEmpty();
	req.checkBody('license', 'license is required').notEmpty();
	req.checkBody('cost', 'cost is required').notEmpty();

	const errors = req.validationErrors();
	if (errors) {
		console.log(errors);
		req.flash('error_msg', errors);
		res.redirect('/addevent');
	} else {
		const newEvent = new Event({
			title,
			description,
			license,
			cost,
			'owner': user._id
		});
		Event.addEvent(newEvent);
		//vehicle.events.push(newEvent._id); // TODO
		res.redirect('/maintenance');
	}
});

// add vehicle
router.post('/addvehicle', isLoggedIn, function (req, res) {
	const inputParams = req.body;
	const type = req.body.type;
	const brand = req.body.brand;
	const model = req.body.model;
	const license = req.body.license;
	const year = req.body.year;
	const km = req.body.km;

	const user = req.session.user;

	// input validation
	req.checkBody('type', 'type is required').notEmpty();
	req.checkBody('brand', 'brand is required').notEmpty();
	req.checkBody('model', 'model is required').notEmpty();
	req.checkBody('license', 'license is required').notEmpty();
	req.checkBody('year', 'year of manufacture is required').notEmpty();
	req.checkBody('km', 'km is required').notEmpty();

	const errors = req.validationErrors();
	if (errors) {
		req.flash('error_msg', errors);
		console.log(errors);
		res.redirect('/addvehicle');
	} else {
		const newVehicle = new Vehicle({
			type,
			brand,
			model,
			license,
			year,
			km,
			'owner': user._id
		});
		Vehicle.addVehicle(newVehicle);
		user.vehicles.push(newVehicle._id); // TODO
		res.redirect('/mygarage');
	}
});

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

	User.findOne({
		"username": username,
		"email": email
	}).then(user => {
		if (user) {
			console.log('User exists!');
			req.flash('error_msg', 'User exists');
			res.redirect('/');
		} else {
			const errors = req.validationErrors();
			if (errors) {
				console.log(errors);
				req.flash('error_msg', errors);
				res.redirect('/');
			} else {
				const newUser = new User({
					email: email,
					username: username,
					password: password
				});
				User.createUser(newUser);
				req.flash('success_msg', 'You are registered and can now login');
				console.log("Registered successfully!");
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
		console.log(errors);
		req.flash('error_msg', errors);
		res.redirect('/');
	} else {
		User.findOne({
			"username": loginParams.username
		}, function (err, user) {
			if (err) {
				console.log(err);
				req.flash('error_msg', err);
				res.redirect('/');
			}
			if (!user || user === null) {
				console.log('user not found');
				req.flash('error_msg', 'User nor found');
				res.redirect('/');
			}

			bcrypt.compare(loginParams.password, user.password, function (err, success) {
				if (err) {
					console.log('password is incorrect!');
					req.flash('error_msg', 'password is incorrect');
					res.redirect('/');
				}

				if (success) {
					req.session.user = user;
					req.flash('success_msg', 'You are logged in');
					console.log('logged in successfully!');
					res.redirect('/mygarage');
				}
			});
		});
	}
});

module.exports = router;