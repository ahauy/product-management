const productsRoutes = require('./products.router')
const homeRoutes = require('./home.router')
const cartRoutes = require('./cart.router')
const checkoutRoutes = require('./checkout.router')
// const cartRoutes = require('./cart.router')
const userRoutes = require('./user.router')
const blogsRoutes = require("./blogs.router")
const middlewareCartId = require('../../middleware/client/cart.middleware')
const middlewareInfoUser = require('../../middleware/client/user.middleware')


module.exports = (app) => {

  app.use(middlewareCartId.cardId)

  app.use(middlewareInfoUser.infoUser)

  app.use('/', homeRoutes)
  
  app.use('/products', productsRoutes)

  app.use('/cart', cartRoutes)

  app.use('/checkout', checkoutRoutes)

  app.use('/user', userRoutes)

  app.use('/blogs', blogsRoutes)
}