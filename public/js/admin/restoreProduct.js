const arrBtnRestore = document.querySelectorAll("[button-restore]");

if (arrBtnRestore.length > 0) {
  
  const formDeleteProduct = document.querySelector("#form-restore");

  const dataPath = formDeleteProduct.getAttribute('data-path')
  arrBtnRestore.forEach((btn) => {
    btn.addEventListener("click", () => {
      console.log("alo")
      const isConfirm = confirm(
        "Are you sure you want to restore ?"
      );

      if (isConfirm) {
        const idItem = btn.getAttribute("data-id");

        formDeleteProduct.action = `${dataPath}/${idItem}?_method=PATCH`

        formDeleteProduct.submit();
      }
    });
  });
}
