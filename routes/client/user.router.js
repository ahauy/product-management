const express = require('express')
const routes = express.Router()
const controller = require('../../controllers/client/userController')

routes.get('/', controller.getUser)

routes.post('/register', controller.postRegister)

routes.post('/login', controller.postLogin)

routes.get('/info', controller.getInfo)

routes.patch('/password/change', controller.changePassword)

routes.get('/orders', controller.getOrders)

routes.get('/address', controller.getAddress)

routes.post('/address/create', controller.createAddress)

routes.get('/address/delete/:addressId', controller.deleteAddress)

routes.get('/address/default/:addressId', controller.defaultAddress)

routes.patch('/address/update/:addressId', controller.updateAddress)

routes.get('/logout', controller.logout)

module.exports = routes;