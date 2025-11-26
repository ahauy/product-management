const formFind = document.querySelector('[form-find]')


if(formFind) {
  const inputFind = document.querySelector('[input-find]')
  const btnFind = document.querySelector('[btn-find]')

  const url = new URL(window.location.href)

  formFind.addEventListener('submit', (e) => {
    e.preventDefault()
    
    const find = inputFind.value


    if(find) {
      url.searchParams.set('keyword', find)
    } else {
      url.searchParams.delete('keyword')
    }

    window.location.href = url.href
  })
}

// hiển thị description vào trong div ở index
const description = document.querySelectorAll('.description')
description.forEach(item => {
  const text = item.textContent
  item.innerHTML = text
})
