let dataBlogCategory = document.querySelector("[data-blog-category]")

// lấy ra mảng các tiêu đề và id của blog_category
let arrBlogCategoryChoose = Array.from(JSON.parse(dataBlogCategory.getAttribute("data-blog-category")))

// chuyển nội dung vào trong .cat-wrapper
arrBlogCategoryChoose.forEach(cat => {
  const newHtml = `
    <div class="cat-title">
      <div id=${cat.categoryId}>${cat.title}</div>
      <ion-icon name="close-outline"></ion-icon>
    </div>
  `;
  catContent.insertAdjacentHTML("beforeend", newHtml);
  addDeleteEvent(".cat-title"); // hàm dùng để xóa cat - được viết trong file createBlog.js
  addInputCategoryId(".cat-title") // hàm dùng để thêm nội dung từ .cat-title vào trong input ẩn - được viết trong file createBlog.js
})

// lấy ra mảng các tags lưu trong CSDL
let dataTags = document.querySelector("[data-tags]")
let arrTagsChoose = Array.from(JSON.parse(dataTags.getAttribute("data-tags")))

// chuyển nội dung vào trong .tag-wrapper
arrTagsChoose.forEach(tag => {
  const newTagHtml = `
    <div class="tag-title">
      <div>${tag}</div>
      <ion-icon name="close-outline"></ion-icon>
    </div>
  `;
  tagContent.insertAdjacentHTML("beforeend", newTagHtml)
  addDeleteEvent(".tag-title"); // hàm dùng để xóa tags - được viết trong file createBlog.js
  addInputTags(".tag-title") // hàm dùng để thêm nội dung từ .tag-title vào trong input ẩn - được viết trong file createBlog.js
})