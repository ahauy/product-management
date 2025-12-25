const { cardId } = require("../../middleware/client/cart.middleware");
const Cart = require("../../models/cart.model");
const ProductsCategory = require("../../models/productsCategory.model");
const Products = require("../../models/products.model");
const createTreeHelper = require("../../helpers/client/createTree"); // Nhớ đường dẫn file helper
const formatMoney = require("../../helpers/client/formatMoney");

// [GET] cart/
module.exports.getCart = async (req, res) => {
  // 1. Lấy danh mục "active" và chưa bị xóa
  const find = {
    deleted: false,
    status: "active",
  };
  const records = await ProductsCategory.find(find);

  // 2. Tạo cây danh mục (Level 1 -> Level 2 -> Level 3)
  const newRecords = createTreeHelper(records);

  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({ _id: cartId }).lean();

  for (item of cart.products) {
    let product = await Products.findOne({ _id: item.productId });

    if (product) {
      item.slug = product.slug;
    }
  }

  // console.log(cart)

  res.render("client/pages/cart/index.cart.pug", {
    cart: cart,
    layoutProductsCategory: newRecords, // Truyền biến này sang view
    formatMoney: formatMoney,
  });
};

// [POST] cart/add/:productID
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

// [GET] /cart/delete/:productId/:size
module.exports.deleteProduct = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const size = req.params.size;

  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      $pull: { products: { productId: productId, size: size } },
    }
  );

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

  res.redirect("/cart/");
};

// [GET] /cart/update/:productId/:quantity
module.exports.updateQuantity = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = parseInt(req.params.quantity);
  const size = req.params.size

  const cart = await Cart.findOne({
    _id: cartId,
  });

  const product = cart.products.find((item) => (item.productId == productId));

  const price = parseInt(product.price);

  const newSubtotal = price*quantity;


  await Cart.updateOne(
    {
      _id: cartId,
      "products.productId": productId,
      "products.size": size,
    },
    {
      "products.$.quantity": quantity,
      "products.$.subtotal": newSubtotal,
    }
  );

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

  res.redirect("/cart/");
};
