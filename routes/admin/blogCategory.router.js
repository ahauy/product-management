const express = require("express");
const routes = express.Router();  
const controller = require("../../controllers/admin/blogCategoryController");
const validate = require('../../validate/admin/product.validate')
const storageMulter = require('../../helpers/admin/storageMulter')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' });

routes.get("/", controller.index);

routes.patch("/change-status/:status/:id", controller.changeStatus)

routes.patch("/change-multi", controller.changeMulti)

routes.patch("/change-position/:id/:position", controller.changePostition)

routes.get("/create", controller.getCreate)

routes.post("/create", upload.single('thumbnail') ,controller.postCreate)

routes.delete("/delete-category/:id", controller.deleteCategory)

routes.get("/edit/:id", controller.getEdit)

routes.patch("/edit/:id", upload.single('thumbnail'), controller.patchEdit)

routes.get("/read/:id", controller.getRead)

routes.get("/trash", controller.getTrash)

routes.patch("/trash/change-multi", controller.trashChangeMulti)

routes.delete("/trash/delete-category/:id", controller.trashDeleteBlog)

routes.patch("/trash/restore-category/:id", controller.trashRestoreBlog)

module.exports = routes;