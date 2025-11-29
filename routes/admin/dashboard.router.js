const express = require('express')
const routes = express.Router()
const controller = require("../../controllers/admin/dashboardController")

routes.get("/", controller.dashboard)

module.exports = routes;