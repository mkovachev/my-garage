function isLoggedIn(req, res, next) {
    if (req.session.user === null) {
        req.flash('error_msg', 'You are not logged in, login now'); // TODO
        res.redirect('/');
    } else {
        next();
    }
};

function isLoggedOut(req, res, next) {
    if (req.session.user !== null) {
        req.session.destroy(function (err) {
            res.redirect('/');
            res.end("Logout success");
            return;
        });
    } else {
        next();
    }
}

module.exports = authGuard