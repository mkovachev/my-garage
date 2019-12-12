const express = require('express')
const loginRouter = express.Router()
const bcrypt = require('bcryptjs')
const Users = require('../models/user')

loginRouter.post('/', async (req, res) => {
    const loginParams = req.body;

    req.checkBody('username', 'username is required').notEmpty();
    req.checkBody('password', 'password is required').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        res.render('home', {
            errors: errors
        });
    } else {
        Users.findOne({
            "username": loginParams.username
        }, (err, user) => {
            if (err) {
                res.redirect('/');
            }
            if (!user || user === null) {
                res.render('home', {
                    errors: "User not found"
                });
            }

            bcrypt.compare(loginParams.password, user.password, (err, success) => {
                if (err) {
                    res.redirect('/');
                }
                if (success) {
                    req.session.user = user;
                    req.flash('success_msg', 'You are logged in');
                    res.redirect('/mygarage');
                }
            });
        });
    }
});

module.exports = loginRouter;