import {DEBUG_SHOWPOS_ONHOVER, SquareSize, PieceSize, setCurrentPosition, GameState, getAppState, setGameState, StartingPosition, setStartingPosition} from "./globals.js"
import {interpretFen, gameStateToFEN, getLegalMoves} from "./chess-utils.js"
import { SetChessSounds, SetPieceImages, drawChessBoard, resizeBoard } from "./board.js"
import { getChessSounds, getPieceImages, loadPieces, loadSounds } from "./resources.js";

const CANVAS = document.getElementById("board-canvas");

const CTX = CANVAS.getContext("2d");

// load the "Bitter" font from Google Fonts
const fontRobotoFile = new FontFace(
	"Roboto",
	"url(/fonts/Roboto-Regular.ttf)",
  );
document.fonts.add(fontRobotoFile);

let PiecesImages = getPieceImages();
let ChessSounds = getChessSounds();
//https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces
//kK/qQ/rR/nN/bB/pP//

function setBoardEditIcons(isWhite){
	let offset = isWhite ? 1 : 0;
	for (let bI = 0; bI < 6; bI++) {
		editButtons[bI + 2].firstChild.src = PiecesImages[(bI * 2) + offset].src;
	}
}

document.addEventListener('keydown', (event) => {
	if(event.key === 'e') toggleEditMode();
});

let boardEditContainer = document.getElementById("board-edit-container");
let editButtons = Array.from(boardEditContainer.children);
let editColorToggle = document.getElementById("bedit-color-toggle")

editColorToggle.addEventListener("click", (event)=>{
	event.preventDefault();
	let appState = getAppState();
	appState.editWhiteMode = !appState.editWhiteMode;
	editColorToggle.style.backgroundColor = appState.editWhiteMode ? "rgb(228, 228, 228)" : "rgb(36, 36, 36)";
	editColorToggle.style.color = appState.editWhiteMode ? "rgb(36, 36, 36)" : "rgb(228, 228, 228)";

	setBoardEditIcons(appState.editWhiteMode);
});

/* 0 delete 1 move 2 king 3 queen 4 rook 5 bishop 6 knight 7 pawn */
for (let bI = 0; bI < 8; bI++) {
	editButtons[bI].addEventListener("click", (event)=>{
		event.preventDefault();
		for (let bII = 0; bII < 8; bII++) {
			editButtons[bII].style.backgroundColor = "";
		}
		
		editButtons[bI].style.backgroundColor = "rgb(36, 36, 36)";
		getAppState().editIndex = bI;
	})
};

document.addEventListener("board-edit", ()=>{
    toggleEditMode();
});

function toggleEditMode(){
	let appState = getAppState();
	appState.editMode = !appState.editMode;
	if(appState.editMode){
		boardEditContainer.style.display = "flex";
	}else{
		boardEditContainer.style.display = "none";
	}
}

let applyFenButton = document.getElementById("apply-fen-button");
let fenInput = document.getElementById("fen-input");
applyFenButton.addEventListener('click', (event) => {
	setGameState(interpretFen(fenInput.value));
	GameState.legalMoves = getLegalMoves(GameState);
	drawChessBoard(GameState.position);
});

loadPieces("classic", "svg");
loadSounds("chesscom");
let allAssets = PiecesImages.concat(ChessSounds);
var len = PiecesImages.length,
    counter = 0;

[].forEach.call( allAssets, function( asset ) {
    if(asset.complete)
      incrementCounter();
    else
      asset.addEventListener( 'load', incrementCounter, false );
} );

function incrementCounter() {
	console.log("piece loaded");
    counter++;
    if ( counter === len ) {
		counter = 0;
        start();
    }
}

function start(){
	setStartingPosition(interpretFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'));
	var DisplayPosition = StartingPosition.position.slice();
	setCurrentPosition(StartingPosition.position.slice());
	SetPieceImages(PiecesImages);
	SetChessSounds(ChessSounds);
	drawChessBoard(DisplayPosition);
	GameState.legalMoves = getLegalMoves(GameState.position);


	//set edit mode icons
	setBoardEditIcons(true);
}