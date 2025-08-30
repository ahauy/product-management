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