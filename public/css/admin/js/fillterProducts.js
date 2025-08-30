// Bộ lọc sản phẩm
const arrayButton = document.querySelectorAll('[button-status]')
if(arrayButton.length > 0) {
  const url = new URL(window.location.href)
  arrayButton.forEach(item => {
    item.addEventListener('click', () => {
      const status = item.getAttribute('button-status');
      url.searchParams.set("status", status)
      // console.log(url)
      window.location.href = url.href;
    }) 
  })
}


// Tìm kiếm sản phẩm
const formSearch = document.querySelector('#form-search')
formSearch.addEventListener('submit', e => {
  e.preventDefault()
  let key = e.target.elements.keyword.value
  const url = new URL(window.location.href)
  if(key) {
    url.searchParams.set('keyword', key)
  } else {
    url.searchParams.delete('keyword')
  }

  window.location.href = url.href;
})