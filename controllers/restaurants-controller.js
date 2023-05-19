const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantsController = {
    getRestaurants: (req, res, next) => {

        const DEFAULT_LIMIT = 9

        const categoryId = Number(req.query.categoryId) || ''

        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || DEFAULT_LIMIT
        const offset = getOffset(limit, page)
        // const where = {}

        // if (categoryId) where.categoryId = categoryId

        return Promise.all([
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

                const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
                const likedRestaurantsId = req.user && req.user.LikedRestaurants.map(lr => lr.id)

                const data = restaurants.rows.map(r => ({
                    ...r,
                    description: r.description.substring(0, 50),
                    isFavorited: favoritedRestaurantsId.includes(r.id),
                    isLiked: likedRestaurantsId.includes(r.id)
                }))
                return res.render('restaurants', {
                    restaurants: data,
                    categories,
                    categoryId,
                    pagination: getPagination(limit, page, restaurants.count)
                })
            })
            .catch(err => next(err))
    },
    getRestaurant: (req, res, next) => {
        Restaurant.findByPk(req.params.id, {
            include: [
                Category,
                { model: Comment, include: User },
                { model: User, as: 'FavoritedUsers' },
                { model: User, as: 'LikedUsers' }
            ],
        })
            .then(restaurant => {
                if (!restaurant) throw new Error("Restaurant didn't exist")

                return restaurant.increment('viewCount')

            })
            .then(restaurant => {
                const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
                // const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
                const isLiked = restaurant.LikedUsers.some(l => l.id === req.user.id)
                res.render('restaurant', {
                    restaurant: restaurant.toJSON(),
                    isFavorited,
                    isLiked
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
    },
    getFeeds: (req, res, next) => {
        Promise.all([
            Restaurant.findAll({
                limit: 10,
                order: [['createdAt', 'DESC']],
                include: [Category],
                raw: true,
                nest: true
            }),
            Comment.findAll({
                limit: 10,
                order: [['createdAt', 'DESC']],
                include: [User, Restaurant],
                raw: true,
                nest: true
            })
        ])
            .then(([restaurants, comments]) => {
                res.render('feeds', {
                    restaurants,
                    comments
                })
            })
            .catch(err => next(err))
    },
    getTopRestaurants: (req, res, next) => {

        Restaurant.findAll({
            include: [
                { model: User, as: 'FavoritedUsers' }
            ]
        })
            .then(restaurants => {
                restaurants = restaurants.map(restaurant => ({
                    ...restaurant.toJSON(),
                    description: restaurant.description.substring(0, 50),
                    favoritesCount: restaurant.FavoritedUsers.length,
                    isFavorited: req.user && req.user.FavoritedRestaurants.map(d => d.id).includes(restaurant.id)
                }))
                restaurants.sort((a, b) => b.favoritesCount - a.favoritesCount)
                restaurants = restaurants.slice(0, 10)
                res.render('top-restaurants', { restaurants })
            })
            .catch(err => next(err))
    },

}

module.exports = restaurantsController