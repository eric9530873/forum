const db = require('../models')
const { User, Restaurant, Comment, Favorite, Like } = db
const { localFileHandler } = require('../helpers/file-helpers')
const bcrypt = require('bcryptjs')

const userController = {
    signUpPage: (req, res) => {
        res.render('signup')
    },
    signUp: (req, res, next) => {
        if (req.body.password !== req.body.passwordCheck) throw new Error('Password do not match')

        User.findOne({ where: { email: req.body.email } })
            .then(user => {
                if (user) throw new Error('Email already exists')

                return bcrypt.hash(req.body.password, 10)
            })
            .then(hash => User.create({
                name: req.body.name,
                email: req.body.email,
                password: hash
            }))
            .then(() => {
                req.flash('success_messages', '成功註冊帳號')
                res.redirect('/signin')
            })
            .catch(err => next(err))
    },
    signInPage: (req, res) => {
        res.render('signin')
    },
    signIn: (req, res) => {
        req.flash('success_messages', '成功登入')
        res.redirect('/restaurants')
    },
    logout: (req, res) => {
        req.flash('success_messages', '登出成功')
        req.logout(function (err) {
            if (err) { return next(err); }
            res.redirect('/signin')
        });

    },
    getUser: (req, res, next) => {
        return User.findByPk(req.params.id, {
            include: [
                Comment
            ]
        })
            .then(user => {
                if (!user) throw new Error("User didn't exist!")

                res.render('users/profile', {
                    user
                })
            })
            .catch(err => next(err))
    },
    editUser: (req, res, next) => {
        User.findByPk(req.params.id)
            .then(user => {
                if (!user) throw new Error("User didn't exist")

                res.render('users/edit', { user })
            })
            .catch(err => next(err))
    },
    putUser: (req, res, next) => {

        Promise.all([
            User.findByPk(req.params.id),
            localFileHandler(req.file)
        ])
            .then(([user, filePath]) => {
                if (!user) throw new Error("User didn't exist!")

                return user.update({
                    name: req.body.name,
                    image: filePath || user.image
                })
            })
            .then(() => {
                res.redirect(`/users/${req.params.id}`)
            })
            .catch(err => next(err))
    },
    addFavorite: (req, res, next) => {
        Promise.all([
            Restaurant.findByPk(req.params.id),
            Favorite.findOne({
                where: {
                    userId: req.user.id,
                    restaurantId: req.params.id
                }
            })
        ])
            .then(([restaurant, favorite]) => {
                if (!restaurant) throw new Error("Restaurant didn't exist")
                if (favorite) throw new Error('You have favorited this restaurant')

                return Favorite.create({
                    userId: req.user.id,
                    restaurantId: req.params.id
                })
            })
            .then(() => res.redirect('back'))
            .catch(err => next(err))
    },
    removeFavorite: (req, res, next) => {
        Favorite.findOne({
            where: {
                userId: req.user.id,
                restaurantId: req.params.id
            }
        })
            .then(favorite => {
                if (!favorite) throw new Error("You haven't favorited this restaurant")

                return favorite.destroy()
            })
            .then(() => res.redirect('back'))
            .catch(err => next(err))
    },
    addLiked: (req, res, next) => {
        Promise.all([
            Restaurant.findByPk(req.params.id),
            Like.findOne({
                where: {
                    userId: req.user.id,
                    restaurantId: req.params.id
                }
            })
        ])
            .then(([restaurant, like]) => {
                if (!restaurant) throw new Error("Restaurant didn't exist")
                if (like) throw new Error('You have favorited this restaurant')

                return Like.create({
                    userId: req.user.id,
                    restaurantId: req.params.id
                })
            })
            .then(() => res.redirect('back'))
            .catch(err => next(err))
    },
    removeLiked: (req, res, next) => {
        Like.findOne({
            where: {
                userId: req.user.id,
                restaurantId: req.params.id
            }
        })
            .then(like => {
                if (!like) throw new Error("You haven't favorited this restaurant")

                return like.destroy()
            })
            .then(() => res.redirect('back'))
            .catch(err => next(err))
    }
}

module.exports = userController