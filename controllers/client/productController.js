const Products = require('../../models/products.model')

module.exports.index = async (req, res) => {

  const products = await Products.find({
    status: "active",
    deleted: false
  }).sort({
    position: "desc"
  })

  const newProducts = products.map(item => {
    item.newPrice = (item.price*(100 - item.discountPercentage)/100).toFixed(0);
    return item;
  })

  res.render('client/pages/products/index.products.pug', {
    titlePage: "Products Page",
    newProducts: newProducts
  })
}

module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      status: "active", 
      slug: req.params.slug
    }

    const product = await Products.findOne(find)

    res.render('client/pages/products/detail.products.pug', {
      titlePage: "Chi tiết sản phẩm",
      product: product
    })
  } catch (error) {
    res.redrirect('/products')
  }
}