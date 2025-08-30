const express = require("express")
const routes = express.Router()

const controller = require("../../controllers/admin/productsController")

routes.get("/", controller.index)

module.exports = routes;