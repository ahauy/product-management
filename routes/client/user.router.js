const express = require('express')
const routes = express.Router()
const controller = require('../../controllers/client/userController')
const userValidate = require("../../validate/client/user.validate")

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

routes.get("/password/forgot", controller.getPasswordForgot)

routes.post("/password/forgot", controller.postPasswordForgot)

routes.get("/password/otp", controller.getOTP)

routes.post("/password/otp", controller.postOTP)

routes.get("/password/new-password", controller.getNewPassword)

routes.post("/password/new-password", userValidate.confirmPassword, controller.postNewPassword)

module.exports = routes;