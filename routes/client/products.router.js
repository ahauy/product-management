const express = require('express')
const routes = express.Router()
const controller = require('../../controllers/client/productController')

// routes.get('/', controller.index)

// routes.get('/:slug', controller.detail)

routes.get('/:slugCategory', controller.productsCategory)

module.exports = routes;