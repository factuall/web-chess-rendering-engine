export const DEBUG_SHOW_NUMBERS = true;
export const DEBUG_SHOWPOS_ONHOVER = false;
export const APPLY_CHESS_RULES = true;
export var ShowPositionSideCharacters = true;
export var SquareSize = 100;
export var PieceSize = 98;
export var CurrentPosition = [];

export function setCurrentPosition(position){
    GameState.position = position;
}

export function toggleSideCharacters(){
    ShowPositionSideCharacters = !ShowPositionSideCharacters;
}

export const GameState = {
    position: [],
    legalMoves: [],
	whiteMoves: true,
	canWhiteCastleQ: true,
	canBlackCastleQ: true,
	canWhiteCastleK: true,
	canBlackCastleK: true,
};

export function playerMoved(){
    GameState.whiteMoves = !GameState.whiteMoves;
}

export function getGameState(){
    return GameState;
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