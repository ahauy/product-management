const { request } = require('express');
const Products = require('../../models/products.model')

const filterStatusHelpers = require('../../helpers/admin/filterStatus')
const searchHelpers = require('../../helpers/admin/search')


module.exports.index = async (req, res) => {
  
  // Tìm kiếm sản phẩm
  let find = {
    deleted: false,
  }

  // Phân trang sản phẩm
  let objPagination = {
    limitItem: 4,
    currentPage: 1
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

  
  // Phân trang
  objPagination.totalPage = Math.ceil(await Products.countDocuments(find) / objPagination.limitItem)
  if(req.query.page) {
    objPagination.currentPage = parseInt(req.query.page)
    if(isNaN(objPagination.currentPage)) {
      objPagination.currentPage = 1;
    }
    else if(objPagination.currentPage <= 0) {
      objPagination.currentPage = 1
    }
    else if(objPagination.currentPage > objPagination.totalPage) {
      objPagination.currentPage = objPagination.totalPage + 1;
    }
  } else {
    objPagination.currentPage = 1;
  }

  objPagination.skip = ((objPagination.currentPage - 1) * objPagination.limitItem)

  const products = await Products.find(find).limit(objPagination.limitItem).skip(objPagination.skip)

  // console.log((products))

  res.render('admin/pages/products/index.pug', {
    title: 'Trang danh sách sản phẩm',
    products: products,
    filterStatus: filterStatus,
    pagination: objPagination,
  })
}