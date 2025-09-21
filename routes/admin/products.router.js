const express = require("express")
const routes = express.Router()

const controller = require("../../controllers/admin/productsController")

routes.get("/", controller.index)

routes.patch("/change-status/:status/:id", controller.changeStatus)

routes.patch("/change-multi", controller.changeMulti)

module.exports = routes;