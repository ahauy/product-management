const express = require("express");
const routes = express.Router();  
const controller = require("../../controllers/admin/productCategoryController");
const validate = require('../../validate/admin/product.validate')
const storageMulter = require('../../helpers/admin/storageMulter')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' });

routes.get("/", controller.index);

routes.patch("/change-status/:status/:id", controller.changeStatus);

routes.patch("/change-multi", controller.changeMulti);

// thay đổi position của sản phẩm
routes.patch('/change-position/:id/:position', controller.changePosition)

routes.get("/create", controller.create)

routes.post("/create",upload.single('thumbnail'),controller.createPost);

routes.patch('/change-status/:status/:id', controller.changeStatus)

routes.delete('/delete-category/:id', controller.deleteCategory)

routes.get("/edit/:id", controller.edit)

routes.patch('/edit/:id', upload.single('thumbnail'), validate.createPost, controller.editPatch)

routes.get('/read/:id', controller.read)

// lấy danh sách các sản phẩm đã bị xoá
routes.get("/trash", controller.getTrash)

// sửa nhiều sản phẩm trong thùng rác
routes.patch("/trash/change-multi", controller.trashChangeMulti)

// Xoá sản phẩm 
routes.delete("/trash/delete-category/:id", controller.trashDeleteProduct) 

// Khôi phục sản phẩm
routes.patch("/trash/restore-category/:id", controller.trashRestoreProduct)

module.exports = routes;