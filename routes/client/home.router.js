const express = require('express')
const routes = express.Router()
const controller = require('../../controllers/client/homeController')

routes.get('/', controller.index)

module.exports = routes;