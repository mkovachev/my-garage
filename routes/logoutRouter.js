const express = require('express');
const router = express.Router();
const loginValidator = require('../middleware/loginValidator');

router.get('/', loginValidator.isLoggedOut, (req, res) => {
    req.flash('success_msg', 'You are logged out');
    res.render('home');
});

module.exports = router;