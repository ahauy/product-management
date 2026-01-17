const systemConfig = require("../../config/system")
const dashboardRouter = require('./dashboard.router')
const productsRouter = require('./products.router')
const productsCategoryRouter = require('./productCategory.router')
const blogCategoryRouter = require('./blogCategory.router.js')
const roleRouter = require('./role.router.js')
const accountsRouter = require('./accounts.router.js')
const authRouter = require('./auth.router.js')
const uploadRouter = require('./upload.router.js')
const authMiddleware = require('../../middleware/auth.middleware.js')
const myAccountRouter = require('./my-account.router.js')

module.exports = (app) => {
  PATH_ADMIN = systemConfig.prefixAdmin
  
  app.use(PATH_ADMIN + "/dashboard", authMiddleware.requireAuth, dashboardRouter)

  app.use(`${PATH_ADMIN}/products`, authMiddleware.requireAuth, productsRouter)

  app.use(`${PATH_ADMIN}/products-category`, authMiddleware.requireAuth, productsCategoryRouter)

  app.use(`${PATH_ADMIN}/blog-category`, authMiddleware.requireAuth, blogCategoryRouter)

  app.use(`${PATH_ADMIN}/role`, authMiddleware.requireAuth, roleRouter)

  app.use(`${PATH_ADMIN}/accounts`, authMiddleware.requireAuth, accountsRouter)

  app.use(`${PATH_ADMIN}/auth`, authRouter)
  
  app.use(`${PATH_ADMIN}/my-account`, authMiddleware.requireAuth, myAccountRouter)

  app.use(`${PATH_ADMIN}/upload`, uploadRouter)
}