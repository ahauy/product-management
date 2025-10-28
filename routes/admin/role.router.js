const express = require('express')
const routes = express.Router()
const controller = require('../../controllers/admin/roleController')

routes.get('/', controller.index);

routes.get('/create', controller.getCreate);

routes.post('/create', controller.postCreate);

routes.get('/edit/:id', controller.getEdit);

routes.patch('/edit/:id', controller.patchEdit);

routes.delete("/delete-role/:id", controller.deleteRole)

routes.get('/permission', controller.getPermission)

module.exports = routes