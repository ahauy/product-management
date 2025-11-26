const express = require('express')
const routes = express.Router()
const controller = require('../../controllers/admin/accountsController')

routes.get('/', controller.index);

module.exports = routes