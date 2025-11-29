const container = document.querySelector('#container')
const overlayCon = document.querySelector('#overlayCon')
const overlayBtn = document.querySelector('#overlayBtn')

overlayBtn.addEventListener('click', () => {
  container.classList.toggle('right-panel-active')

  overlayBtn.classList.remove('btnScaled');
  window.requestAnimationFrame(() => {
    overlayBtn.classList.add('btnScaled')
  })
})