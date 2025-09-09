const btnChangeStatus = document.querySelectorAll('[btn-change-status]')
if(btnChangeStatus.length > 0) {

  const formChangeStatus = document.querySelector('#form-change-status')

  // console.log(formChangeStatus)

  btnChangeStatus.forEach(ele => {
    ele.addEventListener('click', () => {

      // get status and id of item
      const activeCurrent = ele.getAttribute('itemStatus')
      const id = ele.getAttribute('itemId')

      const dataPath = formChangeStatus.getAttribute('data-path')

      // change active
      const activeChange = activeCurrent == 'active' ? 'inactive' : 'active';

      formChangeStatus.action = `${dataPath}/${activeChange}/${id}`
      formChangeStatus.submit()
    })
  })
}