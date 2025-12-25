const User = require('../../models/users.model')
const Cart = require('../../models/cart.model')
const Orders = require('../../models/orders.model')

module.exports.infoUser = async (req, res, next) => {

  const tokenUser = req.cookies.tokenUser

  const user = await User.findOne({
    tokenUser: tokenUser,
    deleted: false,
  }).select('-password')

  if(user) {
    // const cart = await Cart.findOne({cartId: req.cookies.cartId})
    await Cart.updateOne({_id: req.cookies.cartId}, {
      userId: user.id
    })

    const addressDefault = user.addresses.find(add => add.isDefault == true)

    res.locals.user = user
    res.locals.addressDefault = addressDefault
  }

  next();
}