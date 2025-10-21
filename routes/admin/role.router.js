const express = require('express')
const routes = express.Router()
const controller = require('../../controllers/admin/roleController')

routes.get('/', controller.index);

routes.get('/create', controller.getCreate);

routes.post('/create', controller.postCreate);

module.exports = routes