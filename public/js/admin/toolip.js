// Source - https://stackoverflow.com/questions/66286043/add-tooltip-via-javascript-in-bootstrap-5
// Posted by Raeesh Alam
// Retrieved 5/11/2025, License - CC BY-SA 4.0

// const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
// const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
//     this.addEventListener('hide.bs.tooltip', function () {
//         new bootstrap.Tooltip(tooltipTriggerEl)
//     })
//     return new bootstrap.Tooltip(tooltipTriggerEl)
// });


const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
