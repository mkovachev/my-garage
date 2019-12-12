const express = require('express');
const registerRouter = express.Router();
const User = require('../models/user');


registerRouter.post('/', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    // input validation
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    const errors = req.validationErrors();

    User.findOne({
        "username": username,
        "email": email
    }).then(user => {
        if (user) {
            res.redirect('/');
        } else {
            if (errors) {
                res.render('home', {
                    errors: errors
                });
            } else {
                const newUser = new User({
                    email: email,
                    username: username,
                    password: password
                });
                User.createUser(newUser, (err, user) => {
                    if (err) throw err;
                    console.log(user);
                });
                res.redirect('/');
            }
        }
    });
    return;
});

module.exports = registerRouter;