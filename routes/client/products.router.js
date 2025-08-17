const express = require('express')
const routes = express.Router()
const controller = require('../../controllers/client/productController')

routes.get('/', controller.index)

routes.get('/create', controller.create)

module.exports = routes;