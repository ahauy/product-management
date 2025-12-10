const divDescription = document.querySelector(".description")
if(divDescription) {
  const html = divDescription.textContent
  divDescription.textContent = ""
  divDescription.innerHTML = html
}

const input = document.querySelectorAll("input")
input.forEach(item => {
  item.style.pointerEvents = "none";
})

const label = document.querySelectorAll('label')
label.forEach(item => {
  item.style.pointerEvents = "none";
})

const select = document.querySelectorAll('select')
select.forEach(item => {
  item.style.pointerEvents = "none";
})