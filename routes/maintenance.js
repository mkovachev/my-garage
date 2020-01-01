
const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Event = require('../models/event')
const Vehicle = require('../models/vehicle')
const authGuard = require('../middleware/authGuard')

// maintenance - all events
router.get('/maintenance', authGuard.isLoggedIn, function (req, res, next) {
    const id = req.session.user._id;
    Event.find({
        "owner": id
    }, function (err, events) {
        if (err) {
            res.render('maintenance', {
                errors: err
            });
        } else {
            res.render('maintenance', {
                layout: false,
                events: events,
                helpers: {
                    json: function (context) {
                        return JSON.stringify(context);
                    }
                }
            });
            return;
        }
    })
})

module.exports = router