const showImage = document.querySelector('.show-image')
const thumbnail = document.querySelector('.thumbnail').textContent
showImage.style.backgroundImage = `url(${thumbnail})`;
let div = showImage.querySelector("div");
div.remove();
showImage.closest("label").style.border = "none";
