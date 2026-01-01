const eyes = document.querySelectorAll("#password-custom i") 
const inputs = document.querySelectorAll("#password-custom input")


if(eyes || inputs) {
  eyes.forEach((eye, index) => {
    eye.addEventListener("click", e => {
      if(inputs[index].type === "password") {
        inputs[index].type = "text"
        eye.classList.remove("fa-regular", "fa-eye-slash")
        eye.classList.add("fa-regular", "fa-eye")
      } else {
        inputs[index].type = "password"
        eye.classList.remove("fa-regular", "fa-eye")
        eye.classList.add("fa-regular", "fa-eye-slash")
      }
    })
  })
}