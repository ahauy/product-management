const formFilter = document.querySelector('[form-filter]')

if(formFilter) {
  const filterName = formFilter.querySelector('[filter-name]')
  const filterActive = formFilter.querySelector('[filter-active]')
  const filterSort = formFilter.querySelector('[filter-sort]')
  const filterFeatured = formFilter.querySelector("[filter-featured]")
  const btnFilter = formFilter.querySelector('[btn-filter]')

  formFilter.addEventListener('submit', e => {
    e.preventDefault()

    const url = new URL(window.location.href)
    // lấy các giá trị dùng để lọc
    let key = e.target.querySelector('#filter-name').value
    let status = e.target.querySelector('#filter-active').value
    let featured = e.target.querySelector("#filter-featured").value

    // xử lý filter sort
    let stringSort = e.target.querySelector('#filter-sort').value
    let [sortKey, sortValue] = stringSort.split('-')
    
    // xử lý tìm theo tên sản phẩm
    if(key) {
      url.searchParams.set('keyword', key)
    } else {
      url.searchParams.delete('keyword')
    }

    // xử lý tìm kiếm theo trạng thái hoạt động
    if(status) {
      url.searchParams.set('status', status)
    } else {
      url.searchParams.delete('status')
    }

    // xử lý tìm kiếm theo nổi bật hay không
    if(featured) {
      url.searchParams.set("featured", featured)
    } else {
      url.searchParams.delete("featured")
    }

    // tìm kiếm theo thử tự sắp xếp
    if(sortKey || sortValue) {
      url.searchParams.set('sortKey', sortKey)
      url.searchParams.set('sortValue', sortValue)
    } else {
      url.searchParams.delete('sortKey')
      url.searchParams.delete('sortValue')
    }
    
    window.location.href = url.href
  })
}