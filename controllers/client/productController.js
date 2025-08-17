module.exports.index = (req, res) => {
  res.render('client/pages/products/index.products.pug', {
    titlePage: "Products Page"
  })
}

module.exports.create = (req, res) => {
  res.send('Products create page')
}