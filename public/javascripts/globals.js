export const DEBUG_SHOW_NUMBERS = false;
export const DEBUG_SHOWPOS_ONHOVER = false;
export const APPLY_CHESS_RULES = true;
export var ShowPositionSideCharacters = true;
export var SquareSize = 100;
export var PieceSize = 98;
export var CurrentPosition = [];

export function setCurrentPosition(position){
    CurrentPosition = position;
}

export function toggleSideCharacters(){
    ShowPositionSideCharacters = !ShowPositionSideCharacters;
}