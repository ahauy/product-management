const express = require('express')
const routes = express.Router()
const controller = require('../../controllers/client/userController')
const userValidate = require("../../validate/client/user.validate")
const authMiddleware = require("../../middleware/client/auth.middleware")

routes.get('/', controller.getUser)

routes.post('/register', controller.postRegister)

routes.post('/login', controller.postLogin)

routes.get('/info', authMiddleware.authMiddleware, controller.getInfo)

routes.patch('/password/change', authMiddleware.authMiddleware, controller.changePassword)

routes.get('/orders', authMiddleware.authMiddleware, controller.getOrders)

routes.get('/address', authMiddleware.authMiddleware, controller.getAddress)

routes.post('/address/create', authMiddleware.authMiddleware, controller.createAddress)

routes.get('/address/delete/:addressId', authMiddleware.authMiddleware, controller.deleteAddress)

routes.get('/address/default/:addressId', authMiddleware.authMiddleware, controller.defaultAddress)

routes.patch('/address/update/:addressId', authMiddleware.authMiddleware, controller.updateAddress)

routes.get('/logout', authMiddleware.authMiddleware, controller.logout)

routes.get("/password/forgot", controller.getPasswordForgot)

routes.post("/password/forgot", controller.postPasswordForgot)

routes.get("/password/otp", controller.getOTP)

routes.post("/password/otp", controller.postOTP)

routes.get("/password/new-password", controller.getNewPassword)

routes.post("/password/new-password", userValidate.confirmPassword, controller.postNewPassword)

module.exports = routes;