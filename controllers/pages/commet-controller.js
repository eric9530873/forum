const { Comment, User, Restaurant } = require("../../models");


const commentController = {
    postComment: (req, res, next) => {
        if (!req.body.text) throw new Error('Comment text is require')

        Promise.all([
            User.findByPk(req.user.id),
            Restaurant.findByPk(req.body.restaurantId)
        ])
            .then(([user, restaurant]) => {
                if (!user) throw new Error("User didn't exist")
                if (!restaurant) throw new Error("Restaurant didn't exist")

                return Comment.create({
                    text: req.body.text,
                    restaurantId: req.body.restaurantId,
                    userId: req.user.id
                })
            })
            .then(() => {
                res.redirect(`/restaurants/${req.body.restaurantId}`)
            })
            .catch(err => next(err))
    },
    deleteComment: (req, res, next) => {
        Comment.findByPk(req.params.id)
            .then(comment => {
                if (!comment) throw new Error("Comment didn't exist")

                return comment.destroy()
            })
            .then((deleteComment) => res.redirect(`/restaurants/${deleteComment.restaurantId}`))
            .catch(err => next(err))
    }
}

module.exports = commentController