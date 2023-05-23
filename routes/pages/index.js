const express = require('express')
const router = express.Router()
const passport = require('passport')

const admin = require('./modules/admin')

const restaurantsController = require('../../controllers/pages/restaurants-controller')
const userController = require('../../controllers/pages/user-controller')
const commentController = require('../../controllers/pages/commet-controller')

const upload = require('../../middleware/multer')

const { authenticated, authenticatedAdmin } = require('../../middleware/auth')
const { generalErrorHandler } = require('../../middleware/error-handler')

router.use('/admin', authenticatedAdmin, admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

router.get('/logout', userController.logout)

router.get('/users/top', authenticated, userController.getTopUser)
router.get('/users/:id/edit', authenticated, userController.editUser)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

router.get('/restaurants/feeds', authenticated, restaurantsController.getFeeds)
router.get('/restaurants/top', authenticated, restaurantsController.getTopRestaurants)
router.get('/restaurants/:id/dashboard', authenticated, restaurantsController.getDashboard)
router.get('/restaurants/:id', authenticated, restaurantsController.getRestaurant)
router.get('/restaurants', authenticated, restaurantsController.getRestaurants)

router.delete('/comments/:id', authenticated, commentController.deleteComment)
router.post('/comments', authenticated, commentController.postComment)

router.delete('/favorite/:id', authenticated, userController.removeFavorite)
router.post('/favorite/:id', authenticated, userController.addFavorite)

router.delete('/like/:id', authenticated, userController.removeLiked)
router.post('/like/:id', authenticated, userController.addLiked)

router.delete('/following/:id', authenticated, userController.removeFollowing)
router.post('/following/:id', authenticated, userController.addFollowing)


router.get('/', (req, res) => {
    res.redirect('/restaurants')
})

router.use('/', generalErrorHandler)

module.exports = router