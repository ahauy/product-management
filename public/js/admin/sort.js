const sort = document.querySelector('[sort]')
// console.log(sort)
if(sort) {
  const url = new URL(window.location.href);

  const sortSelect = document.querySelector('[sort-select]')
  // console.log(sortSelect)
  sortSelect.addEventListener('change', e => {
    const [sortKey, sortValue] = e.target.value.split('-')

    url.searchParams.set('sortKey', `${sortKey}`)
    url.searchParams.set('sortValue', `${sortValue}`)

    window.location.href = url.href;
  })

  const clear = document.querySelector('[sort-clear]')
  clear.addEventListener('click', e => {
    url.searchParams.delete('sortKey')
    url.searchParams.delete('sortValue')

    window.location.href = url.href;
  })

  const sortKey = url.searchParams.get('sortKey')
  const sortValue = url.searchParams.get('sortValue')
  const stringsort = `${sortKey}-${sortValue}`
  const option = sortSelect.querySelector(`option[value="${stringsort}"]`)
  option.setAttribute('selected', 'true')
}