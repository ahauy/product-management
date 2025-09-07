const { request } = require('express');
const Products = require('../../models/products.model')

const filterStatusHelpers = require('../../helpers/admin/filterStatus')


module.exports.index = async (req, res) => {
  
  // Bộ lọc sản phẩm
  const filterStatus = filterStatusHelpers(req.query)

  // console.log(filterStatus)

  let find = {
    deleted: false,
  }

  // req là phần yêu cầu của người dùng gửi lên sever http://localhost:3000/admin/products?status=active (?status=active đây là phần req và req.query là một đối tượng chứa status=active)
  if(req.query.status) { 
    find.status = req.query.status;
  }

  if(req.query.keyword) {
    const regex = new RegExp(req.query.keyword, "i")
    find.title = regex;
  }


  const products = await Products.find(find)

  // console.log((products))

  res.render('admin/pages/products/index.pug', {
    title: 'Trang danh sách sản phẩm',
    products: products,
    filterStatus: filterStatus
  })
}