const express = require('express');
const router = express.Router();

const Vehicle = require('../models/vehicle');
const authGuard = require('../middleware/authGuard')


// home
router.get('/', function (req, res) {
	res.render('home', { layout: false })
})


// mygarage - all vehicles per user view
router.get('/mygarage', authGuard.checkAuthenticated, function (req, res) {
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


module.exports = router