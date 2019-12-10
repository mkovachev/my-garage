const express = require('express');
const vehicleRouter = express.Router();
const loginValidator = require('../middleware/loginValidator');

vehicleRouter.get('/addvehicle', loginValidator.isLoggedIn, (req, res) => {
    res.render('addvehicle', {
        layout: false
    });
});

// function isLoggedIn(req, res, next) {
//     if (req.session.user === null) {
//         req.flash('error_msg', 'You are not logged in, login now'); // TODO
//         res.redirect('/');
//     } else {
//         next();
//     }
// };

module.exports = vehicleRouter;