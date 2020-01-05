const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/user')

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        try {
            const user = User.findOne({ email })
            if (!user) {
                return done(null, false, { message: 'This email is not registered' })
            }
        } catch (e) {
            return done(e)
        }

        const match = await bcrypt.compare(password, user.password)
        if (!match) return done(null, false, { message: 'Password incorrect' })
        return done(null, user)
    }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.email))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}

module.exports = initialize