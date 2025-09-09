const express = require("express")
const routes = express.Router()

const controller = require("../../controllers/admin/productsController")

routes.get("/", controller.index)

routes.get("/change-status/:status/:id", controller.changeStatus)

module.exports = routes;