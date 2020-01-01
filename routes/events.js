
const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Event = require('../models/event')
const Vehicle = require('../models/vehicle')
const authGuard = require('../middleware/authGuard')

// display event
router.get('/addevent', authGuard.isLoggedIn, function (req, res) {
    res.render('addevent', {
        layout: false
    });
});

// add event
router.post('/addevent', authGuard.isLoggedIn, function (req, res) {
    const inputParams = req.body;
    const title = req.body.title;
    const description = req.body.description;
    const license = req.body.license;
    const cost = req.body.cost;

    const user = req.session.user;

    // input validation
    req.checkBody('title', 'title is required').notEmpty();
    req.checkBody('description', 'description is required').notEmpty();
    req.checkBody('license', 'license is required').notEmpty();
    req.checkBody('cost', 'cost is required').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        res.render('addevent', {
            errors: errors
        });
    } else {
        const newEvent = new Event({
            title,
            description,
            license,
            cost,
            'owner': user._id
        });
        Event.addEvent(newEvent);
        req.flash('success_msg', 'Event successfully added!');
        //vehicle.events.push(newEvent._id); // TODO
        res.redirect('/maintenance');
    }
})

module.exports = router