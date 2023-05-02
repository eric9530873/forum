const { Restaurant, Category } = require('../models')

const restaurantsController = {
    getRestaurants: (req, res) => {
        return Restaurant.findAll({
            include: Category,
            nest: true,
            raw: true
        }).then(restaurants => {
            const data = restaurants.map(r => ({
                ...r,
                description: r.description.substring(0, 50)
            }))
            return res.render('restaurants', {
                restaurants: data
            })
        })
    },
    getRestaurant: (req, res) => {
        Restaurant.findByPk(req.params.id, {
            include: Category,
            nest: true,
            raw: true
        })
            .then(restaurant => {
                if (!restaurant) throw new Error("Restaurant didn't exist")

                res.render('restaurant', {
                    restaurant
                })
            })
    }
}

module.exports = restaurantsController