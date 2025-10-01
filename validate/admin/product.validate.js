module.exports.createPost = (req, res, next) => {
  // validate cho tiêu đề
  if(!req.body.title) {
    req.flash('error', 'Vui lòng hãy nhập tiêu đề cho sản phẩm !!');
    res.redirect('/admin/products/create');
    return;
  }

  next() //cho đi sang controller
}


module.exports.editPatch = (req, res, next) => {
  // validate cho tiêu đề
  if(!req.body.title) {
    req.flash('error', 'Vui lòng hãy nhập tiêu đề cho sản phẩm !!');
    res.redirect(`/admin/products/edit/${req.params.id}`);
    return;
  }

  next() //cho đi sang controller
}