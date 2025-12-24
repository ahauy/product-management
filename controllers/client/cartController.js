const { cardId } = require("../../middleware/client/cart.middleware");
const Cart = require("../../models/cart.model");

module.exports.addPost = async (req, res) => {
  const cartId = req.cookies.cartId;

  const priceInt = parseInt(req.body.price);
  const quantityInt = parseInt(req.body.quantity);

  // lấy giỏ hàng
  const cartAfter = await Cart.findOne({ _id: cartId });

  // kiểm tra xem sản phẩm có trong giỏ hàng hay chưa
  const isProductInCart = cartAfter.products.find(
    (item) => item.productId == req.body.productId && item.size == req.body.size
  );

  if (isProductInCart) {
    const newQuantity = quantityInt + isProductInCart.quantity;
    const newSubtotal = newQuantity * priceInt;
    await Cart.updateOne(
      {
        _id: cartId,
        "products.productId": req.body.productId,
      },
      {
        "products.$.quantity": newQuantity,
        "products.$.subtotal": newSubtotal,
      }
    );
  } else {
    const product = {
      productId: req.body.productId,
      name: req.body.name,
      image: req.body.image,
      price: priceInt,
      size: req.body.size,
      quantity: quantityInt,
      subtotal: priceInt * quantityInt,
    };

    await Cart.updateOne(
      { _id: cartId },
      {
        $push: { products: product },
      }
    );
  }

  const cartBefore = await Cart.findOne({ _id: cartId });
  const totalQuantity = cartBefore.products.reduce((acc, cur) => {
    return acc + cur.quantity;
  }, 0);

  const totalPrice = cartBefore.products.reduce((acc, cur) => {
    return acc + cur.subtotal;
  }, 0);

  await Cart.updateOne(
    { _id: cartId },
    {
      totalQuantity: totalQuantity,
      totalPrice: totalPrice,
    }
  );

  res.redirect(`/products/detail/${req.body.slug}`);
};
