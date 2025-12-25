const notifications = document.querySelector('.notifications');
const status = notifications.dataset.status
const message = notifications.dataset.mess

// function show and hide notification  
function createNofification(status, message) {
    let templateInner = ``
    switch(status) {
        case 'success': 
            templateInner = /* html */ 
            `
            <div class="notification success">
                <i class="fa-solid fa-circle-check"></i>
                <span>${message}</span>
            </div>
            `
            break;
        case 'warning':
                templateInner = /* html */
                `
                <div class="notification warning">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    <span>${message}</span>
                </div>
                `
            break;
        case 'error':
                templateInner = /* html */
                `
                <div class="notification error">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    <span>${message}</span>
                </div>
                `
            break;
    }

    let createDiv = document.createElement('div');
    createDiv.innerHTML = templateInner;
    notifications.appendChild(createDiv);

    // hide notification
    setTimeout(() => {
        createDiv.style.animation = 'hide 2s ease-in-out';
    }, 4000);

    // remove createDiv
    setTimeout(() => {
        createDiv.remove();
    }, 6000);
}

if(message) {
    createNofification(status, message)
}
