const express = require('express')
const router = express.Router()
const passport = require('passport')

const admin = require('../routes/modules/admin')

const restaurantsController = require('../controllers/restaurants-controller')
const userController = require('../controllers/user-controller')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', authenticatedAdmin, admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

router.get('/logout', userController.logout)

router.get('/restaurants/:id/dashboard', authenticated, restaurantsController.getDashboard)
router.get('/restaurants/:id', authenticated, restaurantsController.getRestaurant)
router.get('/restaurants', authenticated, restaurantsController.getRestaurants)

router.get('/', (req, res) => {
    res.redirect('/restaurants')
})

router.use('/', generalErrorHandler)

module.exports = router