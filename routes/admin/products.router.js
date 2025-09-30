const express = require("express")
const routes = express.Router()

const controller = require("../../controllers/admin/productsController")

routes.get("/", controller.index)

routes.patch("/change-status/:status/:id", controller.changeStatus)

routes.patch("/change-multi", controller.changeMulti)

// xoá hoàn toàn sản phẩm khỏi csdl
// routes.delete("/delete-product/:id", controller.deleteProduct)

// tắt trạng thái hoạt động của sản phẩm
routes.delete("/delete-product/:id", controller.deleteProduct)

// in ra giao diện tạo mới sản phẩm
routes.get('/create', controller.create)

// tạo mới sản phẩm
routes.post('/create', controller.createPost)


module.exports = routes;