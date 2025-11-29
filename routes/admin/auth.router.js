const express = require('express')
const routes = express.Router()
const controller = require('../../controllers/admin/authController')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' });
const authValidate = require('../../validate/admin/auth.validate')

routes.get('/login', controller.login);

routes.post('/login', authValidate.loginPost, controller.loginPost)

routes.get('/logout', controller.logout);

module.exports = routes