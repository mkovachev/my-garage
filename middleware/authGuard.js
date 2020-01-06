const authGuard = {
    checkAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
    },

    checkNotAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return res.redirect('/')
        }
        next()
    }
}

module.exports = authGuard