const chkBoxSize = document.querySelector("[chkBoxSize]");
const inputSize = chkBoxSize.querySelectorAll("input");
const selectChooseSize = document.querySelector("[selectChooseSize]");
const inputStock = document.querySelector("[inputStock]");
const stockSum = document.querySelector("[stockSum]");
const arrSizeStock = [];

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
      return acc + currentValue.stock
    }, 0)

    // Reset input
    inputStock.value = "";
    selectChooseSize.value = "";
  }
});
