const Products = require('../../models/products.model')

module.exports.index = async (req, res) => {

  const products = await Products.find({
    status: "active",
    deleted: false
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
