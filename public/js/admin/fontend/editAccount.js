const showImage = document.querySelector('.show-image')
const avatar = document.querySelector('.avatar').textContent
showImage.style.backgroundImage = `url(${avatar})`;
let div = showImage.querySelector("div");
div.remove();
showImage.closest("label").style.border = "none";
