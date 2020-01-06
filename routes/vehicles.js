const express = require('express')
const router = express.Router()
const Vehicle = require('../models/vehicle')
const authGuard = require('../middleware/authGuard')

// display add vehicle
router.get('/addvehicle', authGuard.checkAuthenticated, async (req, res) => {
    res.render('addvehicle')
})

// add vehicle
router.post('/addvehicle', authGuard.checkAuthenticated, async (req, res) => {

    // input validation
    req.checkBody('type', 'type is required').notEmpty()
    req.checkBody('brand', 'brand is required').notEmpty()
    req.checkBody('model', 'model is required').notEmpty()
    req.checkBody('license', 'license is required').notEmpty()
    req.checkBody('year', 'year of manufacture is required').notEmpty()
    req.checkBody('km', 'km is required').notEmpty()

    try {
        const newVehicle = new Vehicle({
            type: req.body.type,
            brand: req.body.brand,
            model: req.body.model,
            license: req.body.license,
            year: req.body.year,
            km: req.body.km,
            'owner': req.session.user._id
        })
        await newVehicle.save()
        res.redirect('/mygarage')
        req.flash('success', 'Vehicle successfully added')
    } catch {
        res.render('mygarage')
        req.flash('error', 'Failed to add vehicle')
    }
})

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

module.exports = router