const btnCat = document.querySelector("[btn-cat]");
const btnTag = document.querySelector("[btn-tag]");
const selectItemBox = document.querySelector(".select_item_box");
const arrSelectItem = document.querySelectorAll(".select_item");
const inputBox = document.querySelector(".input_box");

const catContent = document.querySelector(".cat-content");
const tagContent = document.querySelector(".tag-content");

// --- XỬ LÝ CATEGORY ---
if (btnCat) {
  btnCat.addEventListener("click", (e) => {
    selectItemBox.classList.toggle("hide");
    btnCat.classList.toggle("rotate");
  });
}

if (arrSelectItem.length > 0) {
  arrSelectItem.forEach((item) => {
    item.addEventListener("mouseover", (e) => {
      arrSelectItem.forEach((item) => item.classList.remove("active"));
      item.classList.add("active");
    });

    item.addEventListener("click", (e) => {
      let currentCats = Array.from(
        document.querySelectorAll(".cat-title div")
      ).map((node) => node.textContent.trim());

      if (!currentCats.includes(item.textContent.trim())) {
        const dataId = item.getAttribute("data_id")
        const newHtml = `
          <div class="cat-title">
            <div id=${dataId}>${item.textContent}</div>
            <ion-icon name="close-outline"></ion-icon>
          </div>
        `;
        catContent.insertAdjacentHTML("beforeend", newHtml);
        addDeleteEvent(".cat-title");
        addInputCategoryId(".cat-title")
      }
    });
  });
}

// --- XỬ LÝ TAG (Quan trọng: Chặn Enter) ---
if (btnTag) {
  btnTag.addEventListener("click", (e) => {
    inputBox.classList.toggle("hide");
    btnTag.classList.toggle("rotate");
  });
}

if (inputBox) {
  // Dùng keyup hoặc keydown đều được, nhưng keydown chặn submit tốt hơn
  inputBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // <--- Lệnh này CHẶN form submit
      e.stopPropagation(); // Ngăn sự kiện nổi lên trên

      const tagValue = inputBox.value.trim();

      if (tagValue) {
        let currentTags = Array.from(
          document.querySelectorAll(".tag-title div")
        ).map((node) => node.textContent.trim());

        if (!currentTags.includes(tagValue)) {
          const newTagHtml = `
            <div class="tag-title">
              <div>${tagValue}</div>
              <ion-icon name="close-outline"></ion-icon>
            </div>
          `;
          tagContent.insertAdjacentHTML("beforeend", newTagHtml);
          addDeleteEvent(".tag-title");
          addInputTags(".tag-title")
        }
        inputBox.value = "";
      }
    }
  });
}

// --- HÀM XÓA CHUNG ---
function addDeleteEvent(selector) {
  const closeButtons = document.querySelectorAll(
    `${selector} ion-icon[name='close-outline']`
  );

  closeButtons.forEach((btn) => {
    btn.onclick = function () {
      const parentItem = this.closest(selector);
      if (parentItem) {
        parentItem.remove();
      }
    };
  });
}

// ---- HÀM LẤY DỮ LIỆU ĐỂ VÀO INPUT -------
function addInputTags(selector) {
  // lấy danh sách các tiêu đề trên wrapper
  const nodeList = Array.from(document.querySelectorAll(`${selector} div`))

  const texts = nodeList.map(item => item.textContent.trim())

  const inputTagetTag = document.querySelector("input[name=tags]")
  
  inputTagetTag.value = texts.toString();
}


function addInputCategoryId(selector) {
  // lấy danh sách các tiêu đề trên wrapper
  const nodeList = document.querySelectorAll(`${selector} div`)
  const ids = []
  nodeList.forEach(item => {
    ids.push(`${item.getAttribute("id")}-${item.textContent.trim()}`)
  })

  const inputTagetCategory = document.querySelector("input[name=blog_category]")

  inputTagetCategory.value = ids.toString()

  console.log(inputTagetCategory.value)
}