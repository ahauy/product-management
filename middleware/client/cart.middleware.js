const Cart = require("../../models/cart.model")

module.exports.cardId = async (req, res, next) => {
  if (!req.cookies.cartId) {
    const cart = new Cart();
    await cart.save();

    // thời gian lưu cardId trong cookies là 1 tháng
    const expiresTime = 1000 * 60 * 60 * 24 * 31;

    res.cookie('cartId', cart.id, {
      expires: new Date(Date.now() + expiresTime)
    })
  } else {
    // khi đã có giỏ hàng
  }

  next();
}