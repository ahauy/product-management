const express = require('express')
const routes = express.Router()
const controller = require('../../controllers/client/userController')

routes.get('/', controller.getUser)

routes.post('/register', controller.postRegister)

routes.post('/login', controller.postLogin)

routes.get('/info', controller.getInfo)

routes.get('/orders', controller.getOrders)

routes.get('/address', controller.getAddress)

routes.get('/logout', controller.logout)

module.exports = routes;