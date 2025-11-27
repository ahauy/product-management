const express = require('express')
const routes = express.Router()
const controller = require('../../controllers/admin/accountsController')

routes.get('/', controller.index);

routes.get('/create', controller.create)

module.exports = routes