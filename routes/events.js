
const express = require('express')
const router = express.Router()
const Event = require('../models/event')
const User = require('../models/user')
const authGuard = require('../middleware/authGuard')

// display event
router.get('/', authGuard.checkAuthenticated, async (req, res) => {
    res.render('addevent')
})

// add event
router.post('/', authGuard.checkAuthenticated, async (req, res) => {
    try {
        const email = req.session.passport.user
        const user = await User.findOne({ email })

        const newEvent = new Event({
            title: req.body.title,
            description: req.body.description,
            license: req.body.license,
            cost: req.body.cost,
            'owner': user.id
        })
        await newEvent.save()
        res.render('mygarage')
        req.flash('success', 'Event successfully added!')
    } catch (error) {
        console.log(error)
        res.render('addevent')
        req.flash('error', 'Failed to create event')
    }
})

module.exports = router