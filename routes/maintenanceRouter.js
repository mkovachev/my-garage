const express = require('express');
const maintenanceRouter = express.Router();
const loginValidator = require('../middleware/loginValidator');


maintenanceRouter.get('/', loginValidator.isLoggedIn, (req, res) => {
    const id = req.session.user._id;
    Event.find({
        "owner": id
    }, function (err, events) {
        if (err) {
            res.render('maintenance', {
                errors: err
            });
        } else {
            res.render('maintenance', {
                layout: false,
                events: events,
                helpers: {
                    json: (context) => JSON.stringify(context)
                }
            });
            return;
        }
    })
});

module.exports = maintenanceRouter;