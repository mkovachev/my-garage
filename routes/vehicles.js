const express = require('express')
const router = express.Router()
const Vehicle = require('../models/vehicle')
const User = require('../models/user')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const authGuard = require('../authGuard')

// All vehicles
router.get('/', async (req, res) => {
    let query = Vehicle.find()
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }

    try {
        const vehicles = await query.exec()
        res.render('vehicles/index', {
            vehicle: vehicles,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// New vehicle
router.get('/new', async (req, res) => {
    renderNewPage(res, new Vehicle())
})

// // add vehicle
// router.get('/addvehicle', authGuard.checkAuthenticated, function (req, res) {
// 	res.render('addvehicle', {
// 		layout: false
// 	})
// })

// Create vehicle
router.post('/', async (req, res) => {
    const vehicle = new Vehicle({
        title: req.body.title,
        user: req.body.user,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    })
    saveCover(vehicle, req.body.cover)

    try {
        const newVehicle = await vehicle.save()
        res.redirect(`vehicles/${newVehicle.id}`)
    } catch {
        renderNewPage(res, vehicle, true)
    }
})

// add vehicle
// router.post('/addvehicle', authGurad.checkAuthenticated, function (req, res) {
// 	const inputParams = req.body;
// 	const type = req.body.type;
// 	const brand = req.body.brand;
// 	const model = req.body.model;
// 	const license = req.body.license;
// 	const year = req.body.year;
// 	const km = req.body.km;

// 	const user = req.session.user;

// 	// input validation
// 	req.checkBody('type', 'type is required').notEmpty();
// 	req.checkBody('brand', 'brand is required').notEmpty();
// 	req.checkBody('model', 'model is required').notEmpty();
// 	req.checkBody('license', 'license is required').notEmpty();
// 	req.checkBody('year', 'year of manufacture is required').notEmpty();
// 	req.checkBody('km', 'km is required').notEmpty();

// 	const errors = req.validationErrors();
// 	if (errors) {
// 		res.render('addvehicle', {
// 			errors: errors
// 		});
// 	} else {
// 		const newVehicle = new Vehicle({
// 			type,
// 			brand,
// 			model,
// 			license,
// 			year,
// 			km,
// 			'owner': user._id
// 		});
// 		Vehicle.addVehicle(newVehicle);
// 		req.flash('success_msg', 'Vehicle successfully added!');
// 		// user.vehicles.push(newVehicle._id); // TODO
// 		res.redirect('/mygarage');
// 	}
// });

// Show vehicle 
router.get('/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id)
            .populate('user')
            .exec()
        res.render('vehicles/show', { vehicle: vehicle })
    } catch {
        res.redirect('/')
    }
})

// Edit Vehicle 
router.get('/:id/edit', async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id)
        renderEditPage(res, vehicle)
    } catch {
        res.redirect('/')
    }
})

// Update vehicle 
router.put('/:id', async (req, res) => {
    let vehicle

    try {
        vehicle = await Vehicle.findById(req.params.id)
        vehicle.title = req.body.title
        vehicle.author = req.body.author
        vehicle.publishDate = new Date(req.body.publishDate)
        vehicle.pageCount = req.body.pageCount
        vehicle.description = req.body.description
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(vehicle, req.body.cover)
        }
        await vehicle.save()
        res.redirect(`/books/${vehicle.id}`)
    } catch {
        if (vehicle != null) {
            renderEditPage(res, vehicle, true)
        } else {
            redirect('/')
        }
    }
})

// Delete vehicle Page
router.delete('/:id', async (req, res) => {
    let vehicle
    try {
        vehicle = await Vehicle.findById(req.params.id)
        await vehicle.remove()
        res.redirect('/vehicles')
    } catch {
        if (vehicle != null) {
            res.render('vehicles/show', {
                vehicle: vehicle,
                errorMessage: 'Could not remove vehicle'
            })
        } else {
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, vehicle, hasError = false) {
    renderFormPage(res, vehicle, 'new', hasError)
}

async function renderEditPage(res, vehicle, hasError = false) {
    renderFormPage(res, vehicle, 'edit', hasError)
}

async function renderFormPage(res, vehicle, form, hasError = false) {
    try {
        const users = await User.find({})
        const params = {
            users: users,
            vehicle: vehicle
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating vehicle'
            } else {
                params.errorMessage = 'Error Creating vehicle'
            }
        }
        res.render(`vehicles/${form}`, params)
    } catch {
        res.redirect('/vehicles')
    }
}

function saveCover(vehicle, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        vehicle.coverImage = new Buffer.from(cover.data, 'base64')
        vehicle.coverImageType = cover.type
    }
}

module.exports = router