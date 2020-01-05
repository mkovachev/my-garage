const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Vehicle = require('../models/vehicle')
const authGuard = require('../authGuard')


// home
router.get('/', async (req, res) => {
	res.render('home') //  , { layout: false }
})


// all vehicles per user view
router.get('/mygarage', authGuard.checkAuthenticated, async (req, res) => {
	try {
		const user = await User.findOne({ user: req.session.user })
		const vehicles = await Vehicle.find({ user: user.id }).limit(12).exec()
		res.render('mygarage', {
			user: user,
			userVehicles: vehicles
		})
	} catch (error) {
		console.log(error)
		res.redirect('/')
	}
});


module.exports = router