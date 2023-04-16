const { Restaurant } = require('../models')

const adminController = {
    getRestaurants: (req, res, next) => {
        Restaurant.findAll({
            raw: true
        })
            .then(restaurants => res.render('admin/restaurants', { restaurants: restaurants }))
            .catch(err => next(err))
    },
    createRestaurant: (req, res, next) => {
        res.render('admin/create-restaurant')
    },
    postRestaurant: (req, res, next) => {
        if (!req.body.name) throw new Error('Restaurant name is required')

        Restaurant.create({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            openingHours: req.body.openingHours,
            description: req.body.description
        })
            .then(() => {
                req.flash('success_msg', 'restaurant was successfully created')
                res.redirect('/admin/restaurants')
            })
            .catch(err => next(err))
    }
}

module.exports = adminController