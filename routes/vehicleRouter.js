const express = require('express');
const vehicleRouter = express.Router();
const loginValidator = require('../middleware/loginValidator');
const Vehicle = require('../models/vehicle');

vehicleRouter.get('/', loginValidator.isLoggedIn, async (req, res) => {
    res.render('addvehicle', {
        layout: false
    });
});

// create vehicle
vehicleRouter.post('/', loginValidator.isLoggedIn, async (req, res) => {
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

// update vehicle
vehicleRouter.patch('/:id', loginValidator.isLoggedIn, (req, res) => {

})

// delete vehicle
vehicleRouter.delete('/:id', loginValidator.isLoggedIn, (req, res) => {

})

module.exports = vehicleRouter;