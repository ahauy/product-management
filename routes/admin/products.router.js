const express = require("express");
const routes = express.Router();
const controller = require("../../controllers/admin/productsController");
const cloudinary = require('cloudinary').v2;
const validate = require('../../validate/admin/product.validate')

const storageMulter = require('../../helpers/admin/storageMulter')
const multer  = require('multer')
const upload = multer({ storage: storageMulter() })

routes.get("/", controller.index);

routes.patch("/change-status/:status/:id", controller.changeStatus);

routes.patch("/change-multi", controller.changeMulti);

// xoá hoàn toàn sản phẩm khỏi csdl
// routes.delete("/delete-product/:id", controller.deleteProduct)

// tắt trạng thái hoạt động của sản phẩm
routes.delete("/delete-product/:id", controller.deleteProduct);

// in ra giao diện tạo mới sản phẩm
routes.get("/create", controller.create);

// tạo mới sản phẩm
routes.post("/create", upload.single('thumbnail'), validate.createPost, controller.createPost);

// in ra giao diện sửa mới sản phẩm
routes.get("/edit/:id", controller.edit);

// sửa sản phẩm
routes.patch("/edit/:id", upload.single('thumbnail'), validate.editPatch,controller.editPatch);

module.exports = routes;
