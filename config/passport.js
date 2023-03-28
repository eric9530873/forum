const passport = require('passport')
const LocalStrategy = require('passport-local')

const bcrypt = require('bcryptjs')

const db = require('../models')
const { User } = db

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, email, password, done) {
        User.findOne({ where: { email } })
            .then(user => {
                if (!user) return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))

                bcrypt.compare(password, user.password)
                    .then(res => {
                        if (!res) return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))

                        return done(null, user)
                    })
            })
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findByPk(id)
        .then(user => {
            return done(null, user)
        })
});

module.exports = passport