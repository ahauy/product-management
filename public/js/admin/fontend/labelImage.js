const labelImage = document.querySelectorAll('.label-image')
const formImage = document.querySelectorAll('.form-image')
// const showImage = document.querySelectorAll('.show-image')

formImage.forEach((item, index) => {
  // console.log(item)
  item.addEventListener('change', e => {
    let imageLink = URL.createObjectURL(e.target.files[0])
    uploadImage(e, imageLink)
    let labelImage = e.target.closest('label')
    labelImage.style.border = "none"
  })
})

labelImage.forEach(item => {
  item.addEventListener('dragover', e => {
    e.preventDefault()
  })
})

labelImage.forEach(item => {
  item.addEventListener('drop', e => {
    e.preventDefault()
    let imageLink = URL.createObjectURL(e.dataTransfer.files[0])
    console.log(imageLink)
    uploadImage(e, imageLink)
  })
})

const uploadImage = (e, imageLink) => {
  let showImage = e.target.closest('label').querySelector('.show-image')
  showImage.style.backgroundImage = `url(${imageLink})`;
  let div = showImage.querySelector('div')
  div.remove()
}