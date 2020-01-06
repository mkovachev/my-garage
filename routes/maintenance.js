const express = require('express')
const router = express.Router()
const Event = require('../models/event')
const authGuard = require('../middleware/authGuard')

router.get('/maintenance', authGuard.checkAuthenticated, async (req, res) => {
    const { id } = req.session.user._id;
    try {
        await Event.find({ "owner": id })
        res.render('maintenance')
    } catch {
        res.redirect('/')
        req.flash('error', 'Please login first')
    }
})

module.exports = router