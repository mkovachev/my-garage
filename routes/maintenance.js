const express = require('express')
const router = express.Router()
const Event = require('../models/event')
const User = require('../models/user')
const authGuard = require('../middleware/authGuard')

router.get('/', authGuard.checkAuthenticated, async (req, res) => {
    try {
        const email = req.session.passport.user
        const user = await User.findOne({ email })
        const events = await Event.find({ 'owner': user.id }).limit(12).exec()
        res.render('maintenance', {
            user: user,
            events: events
        })
    } catch {
        res.render('home')
        req.flash('error', 'Please login first')
    }
})

module.exports = router