let settingsPopup = document.getElementById('settings-popup');
let closeButton = document.getElementById('settings-close');

export function openSettings(){
    settingsPopup.style.display = "block";
}

export function closeSettings(){
    settingsPopup.style.display = "none";
}

closeButton.addEventListener('click', ()=>{
    closeSettings();
});