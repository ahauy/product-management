const express = require('express')
const routes = express.Router()
const controller = require('../../controllers/client/cartController')

routes.get("/", controller.getCart)

routes.post('/add/:productId', controller.addPost)

routes.get('/delete/:productId/:size', controller.deleteProduct)

routes.get('/update/:productId/:quantity/:size', controller.updateQuantity)

module.exports = routes;