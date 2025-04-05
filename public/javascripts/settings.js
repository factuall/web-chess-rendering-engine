let settingsPopup = document.getElementById('settings-popup');
let closeButton = document.getElementById('settings-close');
let pieceThemeInput = document.getElementById('settings-chess-icons');
let boardSizeInput = document.getElementById('settings-board-size');

export function openSettings(){
    settingsPopup.style.display = "block";
}

export function closeSettings(){
    settingsPopup.style.display = "none";
}

closeButton.addEventListener('click', ()=>{
    closeSettings();
});

pieceThemeInput.onchange = ()=>{
    let pieceThemePrefChanged = new CustomEvent('piece-theme-pref-changed', {detail: pieceThemeInput.value});
    document.dispatchEvent(pieceThemePrefChanged);
};


let sliderHeld = false;
boardSizeInput.addEventListener('mousedown', (e)=>{
    sliderHeld = true;
});

boardSizeInput.addEventListener('mouseup', (e)=>{
    sliderHeld = false;
});

document.addEventListener('mouseUpdate', (e)=>{
    if(sliderHeld){
        let sizePref = boardSizeInput.value;
        let sizePrefChanged = new CustomEvent('size-pref-changed', {detail: sizePref});
        document.dispatchEvent(sizePrefChanged);
    }
});