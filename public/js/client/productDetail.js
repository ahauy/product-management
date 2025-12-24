// PHẦN HÌNH ẢNH
const mainImg = document.getElementById("MainImg");
const smallImgs = document.querySelectorAll(".small-img");

smallImgs.forEach((img) => {
  img.addEventListener("click", () => {
    // đổi ảnh lớn
    mainImg.src = img.src;

    // làm mờ tất cả ảnh
    smallImgs.forEach((i) => i.classList.remove("click-img"));

    // làm rõ ảnh được click
    img.classList.add("click-img");
  });
});

// PHẦN MÔ TẢ
const divDescription = document.querySelector("#descriptionProduct div");
const description = divDescription.textContent;
divDescription.innerHTML = description;

// PHẦN CHỌN SIZE
const sizeItems = document.querySelectorAll(".size-item");
const sizeSelect = document.getElementById("sizeSelect");
const selectedSizeText = document.getElementById("selectedSize");

// chọn mặc định size đầu
if (sizeItems.length > 0) {
  sizeItems[0].classList.add("active");
  sizeSelect.value = sizeItems[0].dataset.size;
  selectedSizeText.innerText = sizeItems[0].dataset.size;
}

sizeItems.forEach((item) => {
  item.addEventListener("click", () => {
    // bỏ active tất cả
    sizeItems.forEach((i) => i.classList.remove("active"));

    // active size được click
    item.classList.add("active");

    // cập nhật select
    const size = item.dataset.size;
    sizeSelect.value = size;

    // cập nhật text "Kích cỡ: M"
    selectedSizeText.innerText = size;
  });
});

// PHẦN SỐ LƯỢNG SẢN PHẨM
const btnMinus = document.querySelector(".minus");
const btnPlus = document.querySelector(".plus");
const inputQuantity = document.querySelector(".quantity-control input");

let quantity = inputQuantity.value == "" ? 0 : parseInt(inputQuantity.value);

btnPlus.addEventListener("click", () => {
  quantity += 1;
  inputQuantity.value = quantity;
  console.log(inputQuantity.value);
});

btnMinus.addEventListener("click", () => {
  if (quantity > 0) {
    quantity -= 1;
    inputQuantity.value = quantity;
  }
  if (inputQuantity.value == 0) {
    inputQuantity.value = "";
  }
});
