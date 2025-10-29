const tablePermission = document.querySelector("[table-permission]")
if(tablePermission) {
  const buttonPermission = document.querySelector("[button-submit]")
  const permission = []
  buttonPermission.addEventListener('click', () => {
    const rows = tablePermission.querySelectorAll("[data-name]")
    rows.forEach((item, index) => {
      const name = item.getAttribute("data-name");
      const inputs = item.querySelectorAll("input")
      if(name == "id") {
        inputs.forEach(element => {
          permission.push({
            id: element.value,
            permission: []
          })
        });
      } else {
        inputs.forEach((input, index) => {
          if(input.checked) {
            permission[index].permission.push(name)
          }
        })
      }
    })
    const formSubmit = document.querySelector("[form-submit-permission]")
    console.log(formSubmit)
    if(formSubmit) {
      const inputSubmit = formSubmit.querySelector('input[name="permission"]')
      const converData = JSON.stringify(permission)
      inputSubmit.value = converData;
    } 
    formSubmit.submit()
  })
}

// hiển thị các permission đã chọn
const rolesString = document.querySelector("[input-roles]")
if(rolesString) {
  const rolesArr = JSON.parse(rolesString.value)
  rolesArr.forEach((role, index) => {
    const permissions = role.permissions

    permissions.forEach(item => {
      const row = tablePermission.querySelector(`[data-name=${item}]`)
      // console.log(row)
      const input = row.querySelectorAll('td input')[index]
      // console.log(input)

      input.checked = true;
    })
  })
}