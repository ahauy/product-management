const express = require("express");
const routes = express.Router();  
const controller = require("../../controllers/admin/productCategoryController");
const validate = require('../../validate/admin/product.validate')
const storageMulter = require('../../helpers/admin/storageMulter')
const multer  = require('multer')
const upload = multer({ storage: storageMulter() })

routes.get("/", controller.index);

routes.get("/create", controller.create);

routes.post("/create",upload.single('thumbnail'), validate.createPost,controller.createPost);

routes.patch('/change-status/:status/:id', controller.changeStatus)

routes.delete('/delete-category/:id', controller.deleteCategory)

module.exports = routes;