const express = require('express')
const router = express.Router()
const restaurantsController = require('../../controllers/apis/restaurants-controller')



router.get('/restaurants', restaurantsController.getRestaurants)

module.exports = router