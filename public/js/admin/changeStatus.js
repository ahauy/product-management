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

      formChangeStatus.action = `${dataPath}/${activeChange}/${id}?_method=PATCH`
      formChangeStatus.submit()
    })
  })
}

// change status all fontend
const checkboxMulti = document.querySelector('[checkbox-multi]');
if(checkboxMulti) {
  const checkboxAll = checkboxMulti.querySelector("input[name='checkall']")
  const checkboxId = checkboxMulti.querySelectorAll("input[name='id']")

  checkboxAll.addEventListener('click', () => {
    if(checkboxAll.checked) {
      checkboxId.forEach(box => {
        box.checked = true;
      })
    } else {
      checkboxId.forEach(box => {
        box.checked = false;
      })
    }
  })

  checkboxId.forEach(box => {
    box.addEventListener('click', () => {
      let numberCheck = checkboxMulti.querySelectorAll('input[name="id"]:checked').length

      if(numberCheck === checkboxId.length) {
        checkboxAll.checked = true;
      } else {
        checkboxAll.checked = false;
      }
    })
  })
}

// form change active / delete multi
const formChangeMuti = document.querySelector('[form-change-multi]');
formChangeMuti.addEventListener('submit', (e) => {
  e.preventDefault();
  const checkboxMulti = document.querySelector('[checkbox-multi]');
  let inputCheck = checkboxMulti.querySelectorAll('input[name="id"]:checked');
  const inputText = document.querySelector('input[name="ids"]');

  const typeOption = e.target.elements.type.value;

  // console.log(typeOption)
  if(typeOption == 'delete') {
    const isConfirm = confirm("Bạn có chắc chắn là muốn xoá sản phẩm ?")

    if(!isConfirm) {
      return;
    }
  }

  if(inputCheck.length > 0) {
    let ids = [];
    inputCheck.forEach(input => {
      if(typeOption === 'position') {
        const postionInput = input.closest("tr").querySelector('input[name="position"]').value;
        ids.push(`${input.value}-${postionInput}`)
      } else {
        ids.push(input.value)
      }
    })
    inputText.value = ids.join(',')
  } else {
    alert("Bạn hãy chọn ít nhất một sản phẩm để thao tác !!!")
  }

  formChangeMuti.submit()
})
