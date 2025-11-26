const systemConfig = require("../../config/system")
const dashboardRouter = require('./dashboard.router')
const productsRouter = require('./products.router')
const productsCategoryRouter = require('./productCategory.router')
const roleRouter = require('./role.router.js')
const accountsRouter = require('./accounts.router.js')
const uploadRouter = require('./upload.router.js')

module.exports = (app) => {
  PATH_ADMIN = systemConfig.prefixAdmin
  
  app.use(PATH_ADMIN + "/dashboard", dashboardRouter)

  app.use(`${PATH_ADMIN}/products`, productsRouter)

  app.use(`${PATH_ADMIN}/products-category`, productsCategoryRouter)

  app.use(`${PATH_ADMIN}/role`, roleRouter)

  app.use(`${PATH_ADMIN}/accounts`, accountsRouter)

  app.use(`${PATH_ADMIN}/upload`, uploadRouter)
}