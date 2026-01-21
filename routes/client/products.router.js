const express = require('express')
const routes = express.Router()
const controller = require('../../controllers/client/productController')

routes.get('/:slugCategory', controller.productsCategory)

routes.get('/detail/:slugProduct', controller.productDetail)

module.exports = routes;