chkBoxSize = document.querySelector("[chkBoxSize]");
inputSize = chkBoxSize.querySelectorAll("input");
selectChooseSize = document.querySelector("[selectChooseSize]");
inputStock = document.querySelector("[inputStock]");
stockSum = document.querySelector("[stockSum]");
variants = document.querySelector("[variants]");
let btnSubmit = document.querySelector('input[type="submit"]')
let form = document.querySelector('form')
arrSizeStock = [];

let product = document.querySelector("[product]").value;
product = JSON.parse(product);
let arrSizeDB = product.variants.map((item) => item.size);
let variantsDB = product.variants;

// arrSizeStock se luu tru toan bo du lieu sau khi sua
arrSizeStock = variantsDB.map(item => {
  return {
    size: item.size,
    stock: item.stock
  }
})

// đổ các size có trong variants vào các input checkbox
inputSize.forEach((item) => {
  if (arrSizeDB.includes(item.value)) {
    item.checked = true;
  }
});

// khi tich chon/bo chon checkbox size -> cap nhat lai arrSizeStock
inputSize.forEach(checkbox => {
  checkbox.addEventListener('change', e => {
    let size = e.target.value


    if(e.target.checked) {
      if(!arrSizeStock.some(item => item.size === size)) {
        arrSizeStock.push({size: size, stock: 0})
      }
    } else {
      arrSizeStock = arrSizeStock.filter(item => item.size !== size)
    }
    renderSelectSize()
    // console.log(arrSizeStock)
  })
})

// đỗ các size trong db vào trong select size
function renderSelectSize() {
  selectChooseSize.innerHTML = '<option value="">Size</option>';

  arrSizeStock.forEach((item) => {
    let option = document.createElement("option");
    option.value = item.size;
    option.textContent = item.size;
    selectChooseSize.appendChild(option);
  });
}
renderSelectSize()

// khi chọn các size sẽ hiện ra số lượng stock của size đó
selectChooseSize.addEventListener("change", (e) => {
  let size = e.target.value
  let found = arrSizeStock.find(item => item.size === size)

  if(found) {
    inputStock.value = found.stock
  }
});

// lấy tổng số lượng sản phẩm đổ vào trong inputStock
let sumStock = arrSizeStock.reduce((accumulator, currentValue) => {
  return accumulator + currentValue.stock;
}, 0);
stockSum.value = sumStock;

// khi user thay doi stock cap nhat lai arrSizeStock ngay lap tuc
inputStock.addEventListener('keyup', e => {
  let selectedSize = selectChooseSize.value
  let found = arrSizeStock.find(item => item.size === selectedSize)

  if(found) {
    found.stock = Number(inputStock.value)
    let sumStock = arrSizeStock.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.stock;
    }, 0);
    stockSum.value = sumStock;
  }
})


// đổ hình ảnh vào editPage
let showImages = document.querySelectorAll(".show-image");
showImages.forEach((item, index) => {
  let imageLink = `url(${product.media[index].url})`;
  item.style.backgroundImage = imageLink;
  let div = item.querySelector("div");
  div.remove();
  item.closest("label").style.border = "none";
});

form.addEventListener('submit', e => {
  // e.preventDefault()
  variants.value = JSON.stringify(arrSizeStock)
})
