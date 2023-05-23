const { Restaurant, Category, Comment, User } = require('../../models')
const { getOffset, getPagination } = require('../../helpers/pagination-helper')

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

                const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id) ? req.user && req.user.FavoritedRestaurants.map(fr => fr.id) : []
                const likedRestaurantsId = req.user && req.user.LikedRestaurants.map(lr => lr.id) ? req.user && req.user.LikedRestaurants.map(lr => lr.id) : []

                const data = restaurants.rows.map(r => ({
                    ...r,
                    description: r.description.substring(0, 50),
                    isFavorited: favoritedRestaurantsId.includes(r.id),
                    isLiked: likedRestaurantsId.includes(r.id)
                }))
                return res.json({
                    restaurants: data,
                    categories,
                    categoryId,
                    pagination: getPagination(limit, page, restaurants.count)
                })
            })
            .catch(err => next(err))
    }

}

module.exports = restaurantsController