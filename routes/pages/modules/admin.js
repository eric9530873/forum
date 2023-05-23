const express = require('express')
const router = express.Router()

const adminController = require('../../../controllers/pages/admin-controller')

const upload = require('../../../middleware/multer')
const categoryController = require('../../../controllers/pages/category-controller')

router.get('/restaurants/create', adminController.createRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)

router.get('/users', adminController.getUsers)
router.put('/users/:id', adminController.PutUsers)

router.get('/categories/:id', categoryController.getCategories)
router.put('/categories/:id', categoryController.putCategories)
router.delete('/categories/:id', categoryController.deleteCategories)
router.get('/categories', categoryController.getCategories)
router.post('/categories', categoryController.postCategories)

router.get('', (req, res) => { res.redirect('/admin/restaurants') })

module.exports = router