const express = require("express");
const routes = express.Router();  
const controller = require("../../controllers/admin/productCategoryController");
const validate = require('../../validate/admin/product.validate')
const storageMulter = require('../../helpers/admin/storageMulter')
const multer  = require('multer')
const upload = multer({ storage: storageMulter() })

routes.get("/", controller.index);

routes.patch("/change-status/:status/:id", controller.changeStatus);

routes.patch("/change-multi", controller.changeMulti);

// thay đổi position của sản phẩm
routes.patch('/change-position/:id/:position', controller.changePosition)

routes.post("/create",upload.single('thumbnail'), validate.createPost,controller.createPost);

routes.patch('/change-status/:status/:id', controller.changeStatus)

routes.delete('/delete-category/:id', controller.deleteCategory)

routes.get("/edit/:id", controller.edit)

routes.patch('/edit/:id', upload.single('thumbnail'), validate.createPost, controller.editPatch)

module.exports = routes;