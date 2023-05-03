const { Restaurant, Category } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantsController = {
    getRestaurants: (req, res) => {

        const DEFAULT_LIMIT = 9

        const categoryId = Number(req.query.categoryId) || ''

        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || DEFAULT_LIMIT
        const offset = getOffset(limit, page)
        // const where = {}

        // if (categoryId) where.categoryId = categoryId

        Promise.all([
            Restaurant.findAndCountAll({
                include: Category,
                where: {
                    ...categoryId ? { categoryId } : {}
                },
                limit,
                offset,
                nest: true,
                raw: true
            }),
            Category.findAll({ raw: true })
        ])
            .then(([restaurants, categories]) => {
                const data = restaurants.rows.map(r => ({
                    ...r,
                    description: r.description.substring(0, 50)
                }))
                return res.render('restaurants', {
                    restaurants: data,
                    categories,
                    categoryId,
                    pagination: getPagination(limit, page, restaurants.count)
                })
            })
    },
    getRestaurant: (req, res, next) => {
        Restaurant.findByPk(req.params.id, {
            include: Category,
        })
            .then(restaurant => {
                if (!restaurant) throw new Error("Restaurant didn't exist")

                restaurant.increment('viewCount')
                res.render('restaurant', {
                    restaurant: restaurant.toJSON()
                })
            })
            .catch(err => next(err))
    },
    getDashboard: (req, res, next) => {
        Restaurant.findByPk(req.params.id, {
            include: Category,
        })
            .then(restaurant => {
                if (!restaurant) throw new Error("Restaurant didn't exist")

                res.render('dashboard', { restaurant: restaurant.toJSON() })
            })
            .catch(err => next(err))
    }
}

module.exports = restaurantsController