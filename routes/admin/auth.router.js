const express = require('express')
const routes = express.Router()
const controller = require('../../controllers/admin/authController')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' });

routes.get('/login', controller.login);

routes.post('/login', controller.loginPost)

module.exports = routes