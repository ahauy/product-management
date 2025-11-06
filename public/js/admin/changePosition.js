const formChangePosition = document.querySelectorAll('[form-change-position]')
// console.log(formChangePosition)
if(formChangePosition.length > 0) {
  
  formChangePosition.forEach(item => {
    item.addEventListener('submit', e => {
      // e.preventDefault()
      const dataPath = item.getAttribute('data-path')
      const inputPosition = e.target.querySelector('[change-position]')
      const position = inputPosition.value
      const id = inputPosition.getAttribute('idItem') 
      
      item.action = `${dataPath}/${id}/${position}?_method=PATCH`
    })
  })
}
