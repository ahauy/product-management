const Orders = require('../../models/orders.model')
const Cart = require('../../models/cart.model')
const Product = require('../../models/products.model')
const generateRandomString = require('../../helpers/admin/generate')
const formatMoney = require("../../helpers/client/formatMoney");

module.exports.getCheckout = async (req, res) => {

  const orderId = req.params.orderId;

  const order = await Orders.findOne({_id: orderId})

  const discountMoney = order.products.reduce((acc, cur) => {
    return acc + (cur.price - cur.salePrice)
  }, 0)

  res.render('client/pages/checkout/checkout.success.pug', {
    order: order,
    formatMoney: formatMoney,
    discountMoney: discountMoney
  })
}


module.exports.orderPost = async (req, res) => {
  // object lưu thông tin của người mua
  const userInfo = {
    fullName: req.body.fullName,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address, 
    province: req.body.province[1],
    district: req.body.district[1],
    ward: req.body.ward[1],
  }

  // lưu thông tin đơn HÀNG
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({_id: cartId})
  const products = [];

  for(let item of cart.products) {
    const product = await Product.findOne({_id: item.productId})
    const objectProduct = {
      productId: item.productId,
      title: item.name,
      image: item.image,
      price: product.price,
      discountPercentage: product.discountPercentage,
      salePrice: product.salePrice,
      quantity: item.quantity,
      size: item.size,
      subtotal: item.subtotal, // Giá * Số lượng (nên lưu để đỡ tính lại)
    }
    products.push(objectProduct)
  }

  // các thông tin khác
  const note = req.body.note;
  const paymentMethod = req.body.paymentMethod;
  const voucherCode = req.body.voucherCode;
  const totalPrice = cart.totalPrice;

  const orderInfo = {
    code: generateRandomString.generateRandomString(8),
    userInfo: userInfo,
    products: products,
    note: note,
    paymentMethod: paymentMethod,
    voucherCode: voucherCode,
    totalPrice: totalPrice,
    status: "pending",
    paymentStatus: "unpaid"
  }

  const order = new Orders(orderInfo);
  await order.save();

  // 2. Xóa giỏ hàng (vì lúc nãy chưa xóa)
  await Cart.updateOne({ _id: cartId }, { products: [] });

  res.redirect(`/checkout/${order.id}`)
}