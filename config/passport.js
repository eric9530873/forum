const passport = require('passport')
const LocalStrategy = require('passport-local')
const { User, Restaurant } = require('../models')
const bcrypt = require('bcryptjs')


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
    return User.findByPk(id, {
        include: [
            { model: Restaurant, as: 'FavoritedRestaurants' },
            { model: Restaurant, as: 'LikedRestaurants' },
            { model: User, as: 'Followers' },
            { model: User, as: 'Followings' }
        ]
    })
        .then(user => {
            user = user.toJSON()
            // console.log(user)
            return done(null, user)
        })
        .catch(err => done(err))
});

module.exports = passport