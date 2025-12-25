const express = require('express')
const routes = express.Router()
const controller = require('../../controllers/client/checkoutController')

routes.get("/:orderId", controller.getCheckout)

routes.post('/order', controller.orderPost)

module.exports = routes;