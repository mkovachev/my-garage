const express = require('express');
const mygarageRouter = express.Router();
const loginValidator = require('../middleware/loginValidator');
const Vehicles = require('../models/vehicle');
const Users = require('../models/user');

// get all vehicles per user
mygarageRouter.get('/', loginValidator.isLoggedIn, async (req, res) => {
    try {
        const user = await Users.findById(req.session.user._id)
        res.json(user.vehicles)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = mygarageRouter;


   // Vehicles.find({
    //     "owner": id
    // }, (err, vehicles) => {
    //     if (err) {
    //         res.render('mygarage', {
    //             errors: err
    //         });
    //     } else if (vehicles === undefined || vehicles.length == 0) {
    //         req.flash('error_msg', 'You have no vehicles, add one now');
    //         res.redirect('addvehicle');
    //     } else {
    //         res.render('mygarage', {
    //             layout: false,
    //             vehicles: vehicles,
    //             helpers: {
    //                 json: (context) => JSON.stringify(context)
    //             }
    //         });
    //         return;
    //     }
    // })