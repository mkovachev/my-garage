
const isLoggedIn = (req, res, next) => {
    if (req.session.user === null) {
        req.flash('error_msg', 'You are not logged in, login now'); // TODO
        res.redirect('/');
    } else {
        next();
    }
};

const isLoggedOut = (req, res, next) => {
    if (req.session.user !== null) {
        req.session.destroy(() => {
            res.redirect('/');
            res.end("Logout success");
            return;
        });
    } else {
        next();
    }
};

exports.isLoggedIn = isLoggedIn;
exports.isLoggedOut = isLoggedOut;
