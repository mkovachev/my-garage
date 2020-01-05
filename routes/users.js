const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Vehicle = require('../models/vehicle')


// register user
router.post('/', async (req, res) => {
    const existingUser = User.findOne({ email: req.body.email })
    if (existingUser) {
        req.flash('info', 'User with this email already exists!')
        res.render('/')
    }
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const newUser = {
            email: req.body.email,
            password: hashedPassword
        }
        await User.save(newUser)
        res.redirect('/')
    } catch {
        req.flash('info', 'Registration failed! Try again!')
        res.render('/')
    }
})

// display user profile
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const books = await Vehicle.find({ user: user.id }).limit(6).exec()
        res.render('users/show', {
            user: user,
            vehiclesByUser: books
        })
    } catch {
        res.redirect('/')
    }
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

// logout
router.get('/logout', async function (req, res) {
    res.render('home');
});

router.delete('/:id', async (req, res) => {
    let user
    try {
        user = await User.findById(req.params.id)
        await user.remove()
        res.redirect('/users')
    } catch {
        if (user == null) {
            res.redirect('/')
        } else {
            res.redirect(`/users/${user.id}`)
        }
    }
})

module.exports = router