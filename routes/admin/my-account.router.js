const express = require('express')
const routes = express.Router()
const controller = require('../../controllers/admin/myAccountController')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' });

routes.get('/', controller.index);

routes.get('/edit', controller.edit)

routes.patch('/edit', upload.single('avatar'), controller.editPatch)

module.exports = routes