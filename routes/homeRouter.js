const express = require('express');
const homeRouter = express.Router();
const loginValidator = require('../middleware/loginValidator');
const Vehicle = require('../models/vehicle');
const Event = require('../models/event');

// home
homeRouter.get('/', (req, res) => {
	res.render('home');
});

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

module.exports = homeRouter;