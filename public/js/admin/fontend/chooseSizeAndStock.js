let chkBoxSize = document.querySelector("[chkBoxSize]");
let inputSize = chkBoxSize.querySelectorAll("input");
let selectChooseSize = document.querySelector("[selectChooseSize]");
let inputStock = document.querySelector("[inputStock]");
let stockSum = document.querySelector("[stockSum]");
let variants = document.querySelector("[variants]");
let arrSizeStock = [];

// chọn size nào thì size đấy sẽ được hiện ơ selectChooseSize
inputSize.forEach((item) => {
  item.addEventListener("change", () => {
    let selectSizes = Array.from(inputSize)
      .filter((i) => i.checked)
      .map((i) => i.value);

    // xoá hết option cũ đi
    selectChooseSize.innerHTML = '<option value="">Size</option>';

    // thêm option cho size dc chọn
    selectSizes.forEach((size) => {
      let option = document.createElement("option");
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

    let selectedSize = selectChooseSize.value;
    let stockValue = inputStock.value.trim();

    if (!selectedSize) {
      alert("Please select a size!");
      return;
    }
    if (!stockValue || isNaN(stockValue) || stockValue <= 0) {
      alert("Please enter a valid stock number!");
      return;
    }

    // Kiểm tra nếu size đã tồn tại trong mảng → cập nhật, ngược lại thì thêm mới
    let existingIndex = arrSizeStock.findIndex(
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

// khi chọn các size sẽ hiện ra số lượng stock của size đó
selectChooseSize.addEventListener("change", (e) => {
  let size = e.target.value
  let found = arrSizeStock.find(item => item.size === size)

  if(found) {
    inputStock.value = found.stock
  }
});