const { Restaurant, User, Category } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')

const adminController = {
    getRestaurants: (req, res, next) => {
        Restaurant.findAll({
            raw: true,
            include: [Category],
            nest: true
        })
            .then(restaurants => res.render('admin/restaurants', { restaurants: restaurants }))
            .catch(err => next(err))
    },
    createRestaurant: (req, res, next) => {
        Category.findAll({
            raw: true
        })
            .then(categories => res.render('admin/create-restaurant', { categories }))
            .catch(err => next(err))
    },
    postRestaurant: (req, res, next) => {
        if (!req.body.name) throw new Error('Restaurant name is required')

        localFileHandler(req.file).then(filePath => {
            return Restaurant.create({
                name: req.body.name,
                tel: req.body.tel,
                address: req.body.address,
                openingHours: req.body.openingHours,
                description: req.body.description,
                image: filePath || null,
                categoryId: req.body.categoryId
            })
        })
            .then(() => {
                req.flash('success_msg', 'restaurant was successfully created')
                res.redirect('/admin/restaurants')
            })
            .catch(err => next(err))
    },
    getRestaurant: (req, res, next) => {
        Restaurant.findByPk(req.params.id, {
            raw: true,
            nest: true,
            include: [Category]
        })
            .then(restaurant => {
                if (!restaurant) throw new Error("Restaurant didn't exist")
                res.render('admin/restaurant', { restaurant })
            })
            .catch(err => next(err))
    },
    editRestaurant: (req, res, next) => {
        Restaurant.findByPk(req.params.id, {
            raw: true
        })
            .then(restaurant => {
                if (!restaurant) throw new Error("Restaurant didn't exist")


                res.render('admin/edit-restaurant', { restaurant })
            })
            .catch(err => next(err))
    },
    putRestaurant: (req, res, next) => {

        Promise.all([
            Restaurant.findByPk(req.params.id),
            localFileHandler(req.file)
        ])
            .then(([restaurant, filePath]) => {
                if (!restaurant) throw new Error("Restaurant didn't exist")

                return restaurant.update({
                    name: req.body.name,
                    tel: req.body.tel,
                    address: req.body.address,
                    openingHours: req.body.openingHours,
                    description: req.body.description,
                    image: filePath || restaurant.image
                })
            })
            .then(() => {
                req.flash('success_msg', 'restaurant was successfully to update')
                res.redirect('/admin/restaurants')
            })
            .catch(err => next(err))
    },
    deleteRestaurant: (req, res, next) => {
        Restaurant.findByPk(req.params.id)
            .then(restaurant => {
                if (!restaurant) throw new Error("Restaurant didn't exist")

                return restaurant.destroy()
            })
            .then(() => res.redirect('/admin/restaurants'))
            .catch(err => next(err))
    }
}

module.exports = adminController