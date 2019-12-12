const express = require('express');
const mygarageRouter = express.Router();
const loginValidator = require('../middleware/loginValidator');
const Vehicle = require('../models/vehicle');

// mygarage - get all vehicles per user
mygarageRouter.get('/', loginValidator.isLoggedIn, (req, res) => {
    const id = req.session.user._id;
    Vehicle.find({
        "owner": id
    }, (err, vehicles) => {
        if (err) {
            res.render('mygarage', {
                errors: err
            });
        } else if (vehicles === undefined || vehicles.length == 0) {
            req.flash('error_msg', 'You have no vehicles, add one now');
            res.redirect('addvehicle');
        } else {
            res.render('mygarage', {
                layout: false,
                vehicles: vehicles,
                helpers: {
                    json: (context) => JSON.stringify(context)
                }
            });
            return;
        }
    })
});

module.exports = mygarageRouter;