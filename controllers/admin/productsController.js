module.exports.index = (req, res) => {
  res.render('admin/pages/products/index.pug', {
    title: 'Trang danh sách sản phẩm',
  })
}