const express = require('express');
const homeRouter = express.Router();
const bcrypt = require('bcryptjs');
const loginValidator = require('../middleware/loginValidator');

const User = require('../models/user');
const Vehicle = require('../models/vehicle');
const Event = require('../models/event');

// --------------- Routes ---------------------

// home
homeRouter.get('/', (req, res) => {
	res.render('home');
});

//add vehicle
// homeRouter.get('/addvehicle', isLoggedIn, (req, res) => {
// 	res.render('addvehicle', {
// 		layout: false
// 	});
// });

// add event
homeRouter.get('/addevent', loginValidator.isLoggedIn, (req, res) => res.render('addevent', {
	layout: false
}));

// logout
homeRouter.get('/logout', loginValidator.isLoggedOut, (req, res) => {
	res.render('home');
});


//------------------------- VIEWs ---------------
// maintenance - all events
homeRouter.get('/maintenance', loginValidator.isLoggedIn, function (req, res) {
	const id = req.session.user._id;
	Event.find({
		"owner": id
	}, function (err, events) {
		if (err) {
			res.render('maintenance', {
				errors: err
			});
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
homeRouter.get('/mygarage', loginValidator.isLoggedIn, function (req, res) {
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
// add event
homeRouter.post('/addevent', loginValidator.isLoggedIn, function (req, res) {
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
		res.render('addevent', {
			errors: errors
		});
	} else {
		const newEvent = new Event({
			title,
			description,
			license,
			cost,
			'owner': user._id
		});
		Event.addEvent(newEvent);
		req.flash('success_msg', 'Event successfully added!');
		//vehicle.events.push(newEvent._id); // TODO
		res.redirect('/maintenance');
	}
});

// add vehicle
homeRouter.post('/addvehicle', loginValidator.isLoggedIn, function (req, res) {
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
		res.render('addvehicle', {
			errors: errors
		});
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
		req.flash('success_msg', 'Vehicle successfully added!');
		// user.vehicles.push(newVehicle._id); // TODO
		res.redirect('/mygarage');
	}
});

// register
homeRouter.post('/', function (req, res) {
	const username = req.body.username;
	const email = req.body.email;
	const password = req.body.password;

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
homeRouter.post('/mygarage', function (req, res) {
	const loginParams = req.body;

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

module.exports = homeRouter;