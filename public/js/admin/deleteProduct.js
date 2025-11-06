const arrBtnDelete = document.querySelectorAll("[button-delete]");

if (arrBtnDelete.length > 0) {
  
  const formDeleteProduct = document.querySelector("#form-delete");

  const dataPath = formDeleteProduct.getAttribute('data-path')
  arrBtnDelete.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isConfirm = confirm(
        "Are you sure you want to delete ?"
      );

      if (isConfirm) {
        const idItem = btn.getAttribute("data-id");

        formDeleteProduct.action = `${dataPath}/${idItem}?_method=DELETE`

        formDeleteProduct.submit();
      }
    });
  });
}
