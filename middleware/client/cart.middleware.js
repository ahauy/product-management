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
    const cart = await Cart.findOne({_id: req.cookies.cartId})
    if (!cart) {
      // Nếu không tìm thấy giỏ hàng trong DB
      res.locals.miniCart = { totalQuantity: 0 }; 
    } else {
      // Tính toán và gán giỏ hàng như bình thường
      res.locals.miniCart = cart; 
    }
  }

  next();
}