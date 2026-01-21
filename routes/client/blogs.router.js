const express = require('express')
const routes = express.Router()
const controller = require('../../controllers/client/blogsController')

routes.get('/:slug', controller.blogDetail)

module.exports = routes;