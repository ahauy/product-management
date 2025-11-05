// chọn số sản phẩm hiển thị cho mỗi trang
const formNumberItemsPage = document.querySelector('[form-number-items-page]')
if(formNumberItemsPage) {
  const selectNumberItemsPage = document.querySelector('[select-number-items-page]')

  let url = new URL(window.location.href)

  selectNumberItemsPage.addEventListener("change", e => {
    const numberItemsPage = e.target.value
    if(numberItemsPage) {
      url.searchParams.set("limit", numberItemsPage)
    } else {
      url.searchParams.delete("limit")
    }
    window.location.href = url.href
  })
}

// chọn trang 
const pagePaginations = document.querySelectorAll('[page-pagination]')
if(pagePaginations.length > 0) {
  const url = new URL(window.location.href)
  pagePaginations.forEach(item => {
    item.addEventListener('click', e => {
      const page = item.getAttribute('page-pagination')
      if(page) {
        url.searchParams.set('page', page)
      } else {
        url.searchParams.delete('page')
      }
      window.location.href = url.href
    })
  })
}