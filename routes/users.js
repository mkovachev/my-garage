const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Vehicle = require('../models/vehicle')
const bcrypt = require('bcryptjs')
const authGuard = require('../middleware/authGuard')
const passport = require('passport')


// register user
router.post('/', async (req, res) => {
    const existingUser = await User.findOne({ email: req.body.email })
    if (existingUser) {
        req.flash('info', 'User with this email already exists!')
    }
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const newUser = new User({
            email: req.body.email,
            password: hashedPassword
        })
        await newUser.save()
    } catch {
        req.flash('info', 'Registration failed! Try again!')
        res.render('home')
    }
})

// login
router.post('/mygarage',
    passport.authenticate('local', {
        successRedirect: '/mygarage',
        failureRedirect: '/',
        successFlash: true,
        failureFlash: true
    }))

// mygarage - all vehicles per user view
router.get('/mygarage', authGuard.checkAuthenticated, async (req, res) => {
    try {
        const email = req.session.passport.user
        const user = await User.findOne({ email })
        const vehicles = await Vehicle.find({ 'owner': user.id }).limit(12).exec()

        res.render('mygarage', {
            user: user,
            vehicles: vehicles
        })
    } catch {
        req.flash('info', 'Please login first')
        res.render('home')
    }
})

// logout
router.get('/logout', async (req, res) => {
    req.logOut()
    req.session = null
    req.flash('info', 'Logout successfull')
    return res.redirect('/')
})

// display edit
router.get('/:id/edit', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.render('users/edit', { user: user })
    } catch {
        res.redirect('/users')
    }
})

// edit
router.put('/:id', async (req, res) => {
    let user
    try {
        user = await User.findById(req.params.id)
        user.name = req.body.name
        await user.save()
        res.redirect(`/users/${user.id}`)
    } catch {
        if (user == null) {
            res.redirect('/')
        } else {
            res.render('users/edit', {
                user: user,
                errorMessage: 'Error updating user'
            })
        }
    }
})

//delete
router.delete('/:id', async (req, res) => {
    let user
    try {
        user = await User.findById(req.params.id)
        await user.remove()
        res.redirect('/')
    } catch {
        req.flash('info', 'Failed to delete user. Try again')
        res.render('/')
    }
})

module.exports = router