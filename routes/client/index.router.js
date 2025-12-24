const productsRoutes = require('./products.router')
const homeRoutes = require('./home.router')
const cartRoutes = require('./cart.router')
const middlewareCartId = require('../../middleware/client/cart.middleware')

module.exports = (app) => {

  app.use(middlewareCartId.cardId)

  app.use('/', homeRoutes)
  
  app.use('/products', productsRoutes)

  app.use('/cart', cartRoutes)
}