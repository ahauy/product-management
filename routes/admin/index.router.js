const systemConfig = require("../../config/system")
const dashboardRouter = require('./dashboard.router')
const productsRouter = require('./products.router')
const productsCategoryRouter = require('./productCategory.router')
const roleController = require('./role.router.js')

module.exports = (app) => {
  PATH_ADMIN = systemConfig.prefixAdmin
  app.use(PATH_ADMIN + "/dashboard", dashboardRouter)

  app.use(`${PATH_ADMIN}/products`, productsRouter)

  app.use(`${PATH_ADMIN}/products-category`, productsCategoryRouter)

  app.use(`${PATH_ADMIN}/role`, roleController)
}