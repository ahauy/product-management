const express = require('express')
const routes = express.Router()
const controller = require('../../controllers/client/userController')

routes.get('/', controller.getUser)

routes.post('/register', controller.postRegister)

module.exports = routes;