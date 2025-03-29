export const DEBUG_SHOW_NUMBERS = false;
export const DEBUG_SHOWPOS_ONHOVER = false;
export const APPLY_CHESS_RULES = true;
export let ShowPositionSideCharacters = true;
export let SquareSize = 100;
export let PieceSize = 98;
export let CurrentPosition = [];
export let StartingPosition;

export function setCurrentPosition(position){
    GameState.position = position;
}

export function setStartingPosition(position){
    StartingPosition = position;
}

export function toggleSideCharacters(){
    ShowPositionSideCharacters = !ShowPositionSideCharacters;
}

export const AppState = {
    editMode: false,
    editIndex: -1,
    editWhiteMode: true 
}

export let GameState = {
    position: [],
    legalMoves: [],
    moveHistory: [],
	whiteMoves: true,
	canWhiteCastleQ: true,
	canBlackCastleQ: true,
	canWhiteCastleK: true,
	canBlackCastleK: true,
    enPassant: -1,
    winState: -1 //still in game; 0 - stalemate; 1 - white won; 2 - black won
};

export function playerMoved(){
    GameState.whiteMoves = !GameState.whiteMoves;
}

export function getGameState(){
    return GameState;
}

export function setGameState(newGameState){
    GameState = newGameState;

}

export function getAppState(){
    return AppState;
}

export function kingMoved(isWhite){
    if(isWhite){
        GameState.canWhiteCastleK = false;
        GameState.canWhiteCastleQ = false;
    }else{
        GameState.canBlackCastleK = false;
        GameState.canBlackCastleQ = false;
    }
}

export function rookMoved(isWhite, isKingSide){
    if(isKingSide && isWhite) GameState.canWhiteCastleK = false;
    if(!isKingSide && isWhite) GameState.canWhiteCastleQ = false;
    if(isKingSide && !isWhite) GameState.canBlackCastleK = false;
    if(!isKingSide && !isWhite) GameState.canBlackCastleQ = false;
}