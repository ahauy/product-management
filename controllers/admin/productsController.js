const { request } = require('express');
const Products = require('../../models/products.model')

const filterStatusHelpers = require('../../helpers/admin/filterStatus')
const searchHelpers = require('../../helpers/admin/search')


module.exports.index = async (req, res) => {
  
  let find = {
    deleted: false,
  }

  // Bộ lọc sản phẩm
  const filterStatus = filterStatusHelpers(req.query)

  // console.log(filterStatus)

  // req là phần yêu cầu của người dùng gửi lên sever http://localhost:3000/admin/products?status=active (?status=active đây là phần req và req.query là một đối tượng chứa status=active)
  if(req.query.status) { 
    find.status = req.query.status;
  }

  // Tìm kiếm sản phẩm
  if(searchHelpers(req.query)) {
    find.title = searchHelpers(req.query)
  }

  const products = await Products.find(find)

  // console.log((products))

  res.render('admin/pages/products/index.pug', {
    title: 'Trang danh sách sản phẩm',
    products: products,
    filterStatus: filterStatus
  })
}