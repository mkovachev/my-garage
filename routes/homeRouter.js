const express = require('express');
const homeRouter = express.Router();

// home
homeRouter.get('/', (req, res) => {
	res.render('home');
});

module.exports = homeRouter;