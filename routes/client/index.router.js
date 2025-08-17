const productsRoutes = require('./products.router')
const homeRoutes = require('./home.router')

module.exports = (app) => {
  app.use('/', homeRoutes)
  
  app.use('/products', productsRoutes)
}