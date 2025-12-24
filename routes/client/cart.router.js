const express = require('express')
const routes = express.Router()
const controller = require('../../controllers/client/cartController')

routes.get("/", controller.getCart)

routes.post('/add/:productId', controller.addPost)

module.exports = routes;