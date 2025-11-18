const chkBoxSize = document.querySelector("[chkBoxSize]");
const inputSize = chkBoxSize.querySelectorAll("input");
const selectChooseSize = document.querySelector("[selectChooseSize]");
const inputStock = document.querySelector("[inputStock]");
const stockSum = document.querySelector("[stockSum]");
const variants = document.querySelector("[variants]");
const arrSizeStock = [];

// chọn size nào thì size đấy sẽ được hiện ơ selectChooseSize
inputSize.forEach((item) => {
  item.addEventListener("change", () => {
    const selectSizes = Array.from(inputSize)
      .filter((i) => i.checked)
      .map((i) => i.value);

    // xoá hết option cũ đi
    selectChooseSize.innerHTML = '<option value="">Size</option>';

    // thêm option cho size dc chọn
    selectSizes.forEach((size) => {
      const option = document.createElement("option");
      option.value = size;
      option.textContent = size;
      selectChooseSize.appendChild(option);
    });
  });
});

// chọn size và nhập stock cho size đó
inputStock.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    e.preventDefault();

    const selectedSize = selectChooseSize.value;
    const stockValue = inputStock.value.trim();

    if (!selectedSize) {
      alert("Please select a size!");
      return;
    }
    if (!stockValue || isNaN(stockValue) || stockValue <= 0) {
      alert("Please enter a valid stock number!");
      return;
    }

    // Kiểm tra nếu size đã tồn tại trong mảng → cập nhật, ngược lại thì thêm mới
    const existingIndex = arrSizeStock.findIndex(
      (item) => item.size === selectedSize
    );
    if (existingIndex !== -1) {
      arrSizeStock[existingIndex].stock = Number(stockValue);
    } else {
      arrSizeStock.push({ size: selectedSize, stock: Number(stockValue) });
    }

    // Hiển thị kết quả
    stockSum.value = arrSizeStock.reduce((acc, currentValue) => {
      return acc + currentValue.stock;
    }, 0);

    variants.value = JSON.stringify(arrSizeStock);

    // Reset input
    inputStock.value = "";
    selectChooseSize.value = "";
  }
});

// bên trên là dữ liệu nhập tay
// đây là phần đổ từ cớ sở dữ liệu sang
let product = document.querySelector("[product]").value;
product = JSON.parse(product)
console.log(product)
let arrSizeDB = (product.variants).map((item) => item.size);
let variantsDB = product.variants;

// đổ các size có trong variants vào các input checkbox
inputSize.forEach((item) => {
  if (arrSizeDB.includes(item.value)) {
    item.checked = true;
  }
});

// đỗ các size trong db vào trong select size
selectChooseSize.innerHTML = '<option value="">Size</option>';
arrSizeDB.forEach((size) => {
  const option = document.createElement("option");
  option.value = size;
  option.textContent = size;
  selectChooseSize.appendChild(option);
});

// khi chọn các size sẽ hiện ra số lượng stock của size đó
selectChooseSize.addEventListener("change", (e) => {
  let index = arrSizeDB.indexOf(e.target.value);
  inputStock.value = `${variantsDB[index].stock}`;
});

// lấy tổng số lượng sản phẩm đổ vào trong inputStock
let sumStock = variantsDB.reduce((accumulator, currentValue) => {
  return accumulator + currentValue.stock;
}, 0);

stockSum.value = sumStock;



// đổ hình ảnh vào editPage
const showImages = document.querySelectorAll('.show-image')
console.log(showImages)
showImages.forEach((item, index) => {
  let imageLink = `url(${product.media[index].url})`
  item.style.backgroundImage = imageLink;
  let div = item.querySelector('div')
  div.remove()
  item.closest('label').style.border = "none"
})
