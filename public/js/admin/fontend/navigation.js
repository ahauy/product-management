// NAVIGATION ACTIVE
const list = document.querySelectorAll(".navigation li")
const ul = document.querySelector(".navigation ul")
const pathname = window.location.pathname

function activeLink() {
  list.forEach(item => {
    // if(item,childNodes[0].getAttribute("href") !== pathname) {
    //   item.classList.remove("hovered")
    // }
    item.classList.remove("hovered")
  })
  this.classList.add("hovered")
}

list.forEach(item => {
  item.addEventListener("mouseover", activeLink)
})

// ul.addEventListener("mouseout", () => {
//   if(item.childNodes[0].getAttribute("href") === pathname) {
//     item.classList.add('hovered')
//   }
// })

// OFF NAVIGATION - OPEN NAVIGATION
const toggle = document.querySelector('.toggle')
const navigation = document.querySelector('.navigation')
const main = document.querySelector('.main')

toggle.addEventListener('click', e => {
  navigation.classList.toggle('active')
  main.classList.toggle('active')
})


list.forEach(item => {
  if(item.childNodes[0].getAttribute("href") === pathname) {
    item.classList.add('hovered')
  }
})