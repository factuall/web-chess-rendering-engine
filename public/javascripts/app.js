import {DEBUG_SHOWPOS_ONHOVER, SquareSize, PieceSize, setCurrentPosition, GameState, getAppState, setGameState} from "./globals.js"
import {interpretFen, gameStateToFEN, getLegalMoves} from "./chess-utils.js"
import { SetChessSounds, SetPieceImages, drawChessBoard, resizeBoard } from "./board.js"

const CANVAS = document.getElementById("board-canvas");

const CTX = CANVAS.getContext("2d");

// load the "Bitter" font from Google Fonts
const fontRobotoFile = new FontFace(
	"Roboto",
	"url(/fonts/Roboto-Regular.ttf)",
  );
document.fonts.add(fontRobotoFile);


let StartingPosition = interpretFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
let TwokingsPosition = interpretFen('3k4/8/8/8/8/4K3/8/8 w KQkq - 0 1');
let SlidingPieces = interpretFen('8/1QrBb3/8/8/8/4K3/8/8 w KQkq - 0 1');


let PiecesImages = [];
let ChessSounds = [];
//https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces
//kK/qQ/rR/nN/bB/pP//
function loadPieces(){
	PiecesImages.push(new Image());
	PiecesImages[0].src = "/images/Chess_kdt45.svg";
	PiecesImages.push(new Image());
	PiecesImages[1].src = "/images/Chess_klt45.svg";

	PiecesImages.push(new Image());
	PiecesImages[2].src = "/images/Chess_qdt45.svg";
	PiecesImages.push(new Image());
	PiecesImages[3].src = "/images/Chess_qlt45.svg";

	PiecesImages.push(new Image());
	PiecesImages[4].src = "/images/Chess_rdt45.svg";
	PiecesImages.push(new Image());
	PiecesImages[5].src = "/images/Chess_rlt45.svg";

	PiecesImages.push(new Image());
	PiecesImages[6].src = "/images/Chess_ndt45.svg";
	PiecesImages.push(new Image());
	PiecesImages[7].src = "/images/Chess_nlt45.svg";

	PiecesImages.push(new Image());
	PiecesImages[8].src = "/images/Chess_bdt45.svg";
	PiecesImages.push(new Image());
	PiecesImages[9].src = "/images/Chess_blt45.svg";

	PiecesImages.push(new Image());
	PiecesImages[10].src = "/images/Chess_pdt45.svg";
	PiecesImages.push(new Image());
	PiecesImages[11].src = "/images/Chess_plt45.svg";
	
}

//only soundset available: chesscom
//move/capture/castle/game-start/game-end/
function loadSounds(soundSet){
	ChessSounds.push(new Audio());
	ChessSounds[0].src = `/sounds/${soundSet}/move.wav`;
	ChessSounds.push(new Audio());
	ChessSounds[1].src = `/sounds/${soundSet}/capture.wav`;
	ChessSounds.push(new Audio());
	ChessSounds[2].src = `/sounds/${soundSet}/castle.wav`;
	ChessSounds.push(new Audio());
	ChessSounds[3].src = `/sounds/${soundSet}/check.mp3`;
	ChessSounds.push(new Audio());
	ChessSounds[4].src = `/sounds/${soundSet}/game-start.wav`;
	ChessSounds.push(new Audio());
	ChessSounds[5].src = `/sounds/${soundSet}/game-end.wav`;
}

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

windowResized();
addEventListener("resize", (e) => {
	windowResized();
});

function windowResized(){
	let squareMin = Math.min(window.innerHeight, window.innerWidth);
	if(window.innerWidth<(window.innerHeight*1.35)) squareMin /= 1.15;
	resizeBoard(squareMin-(squareMin/4));
}

loadPieces();
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
    counter++;
    if ( counter === len ) {
        start();
    }
}

var DisplayPosition = StartingPosition.position.slice();
setCurrentPosition(StartingPosition.position.slice());

function start(){
	SetPieceImages(PiecesImages);
	SetChessSounds(ChessSounds);
	drawChessBoard(DisplayPosition);
	GameState.legalMoves = getLegalMoves(GameState.position);


	//set edit mode icons
	setBoardEditIcons(true);
}