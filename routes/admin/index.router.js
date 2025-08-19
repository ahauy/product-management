const systemConfig = require("../../config/system")

const dashboardRouter = require('./dashboard.router')

module.exports = (app) => {
  PATH_ADMIN = systemConfig.prefixAdmin
  app.use(PATH_ADMIN + "/dashboard", dashboardRouter)
}