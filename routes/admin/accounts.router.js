const express = require('express')
const routes = express.Router()
const controller = require('../../controllers/admin/accountsController')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' });

routes.get('/', controller.index);

routes.get('/create', controller.create)

routes.post('/create', upload.single('avatar'), controller.createPost)

routes.patch("/change-status/:status/:id", controller.changeStatus);

routes.delete('/delete-account/:id', controller.deleteAccount)

module.exports = routes