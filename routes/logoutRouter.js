const express = require('express');
const logoutRouter = express.Router();
const loginValidator = require('../middleware/loginValidator');

logoutRouter.get('/', loginValidator.isLoggedOut, (req, res) => {
    req.flash('success_msg', 'You are logged out');
    res.render('home');
});

module.exports = logoutRouter;