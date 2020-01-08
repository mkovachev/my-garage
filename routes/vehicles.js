const express = require('express')
const router = express.Router()
const Vehicle = require('../models/vehicle')
const authGuard = require('../middleware/authGuard')
const User = require('../models/user')

// display add vehicle
router.get('/', authGuard.checkAuthenticated, async (req, res) => {
    res.render('addvehicle')
})

// add vehicle
router.post('/', authGuard.checkAuthenticated, async (req, res) => {
    try {
        const email = req.session.passport.user
        const user = await User.findOne({ email })

        const newVehicle = new Vehicle({
            type: req.body.type,
            brand: req.body.brand,
            model: req.body.model,
            license: req.body.license,
            year: req.body.year,
            km: req.body.km,
            'owner': user.id
        })
        await newVehicle.save()
        res.render('mygarage')
        req.flash('success', 'Vehicle successfully added')
    } catch {
        res.render('mygarage')
        req.flash('error', 'Failed to add vehicle')
    }
})

// vehicle details
router.get('/:id/details', async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id)
            .populate('user')
            .exec()
        res.render('vehicles/details', { vehicle: vehicle })
    } catch {
        res.redirect('/')
    }
})

// edit Vehicle 
router.get('/:id/edit', async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id)
        res.render('vehicles/edit', { vehicle: vehicle })
    } catch {
        res.redirect('/')
    }
})

// Update vehicle 
router.put('/:id', async (req, res) => {
    let vehicle

    try {
        const vehicle = await Vehicle.findById(req.params.id)
        //vehicle = { type, brand, model, license, year, km } = req.body
        vehicle = { ...req.body }
        await vehicle.save()
        res.redirect(`/vehicles/details`)
    } catch {
        if (vehicle != null) {
            res.render('vehicles/edit', { vehicle: vehicle })
        } else {
            redirect('/')
        }
    }
})

// Delete vehicle Page
router.delete('/:id', async (req, res) => {
    let vehicle
    try {
        const vehicle = await Vehicle.findById(req.params.id)
        await vehicle.remove()
        res.redirect('/vehicles')
    } catch {
        if (vehicle !== null) {
            res.render('vehicles/details', {
                vehicle: vehicle,
                errorMessage: 'Could not remove vehicle'
            })
        } else {
            res.redirect('/')
        }
    }
})

module.exports = router