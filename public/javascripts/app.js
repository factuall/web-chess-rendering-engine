import {DEBUG_SHOWPOS_ONHOVER, SquareSize, PieceSize, setCurrentPosition, GameState, getAppState} from "./globals.js"
import {InterpretFen, PositionToFen, GetLegalMoves} from "./chess-utils.js"
import { SetChessSounds, SetPieceImages, drawChessBoard } from "./board.js"

const CANVAS = document.getElementById("board-canvas");

const CTX = CANVAS.getContext("2d");

// load the "Bitter" font from Google Fonts
const fontRobotoFile = new FontFace(
	"Roboto",
	"url(/fonts/Roboto-Regular.ttf)",
  );
document.fonts.add(fontRobotoFile);


let StartingPosition = InterpretFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
let TwokingsPosition = InterpretFen('3k4/8/8/8/8/4K3/8/8 w KQkq - 0 1');
let SlidingPieces = InterpretFen('8/1QrBb3/8/8/8/4K3/8/8 w KQkq - 0 1');
let testPosition = InterpretFen('4k3/8/8/4r3/8/4R3/8/4K3 w - - 0 1');
let twoKnights = InterpretFen('5n2/8/8/8/8/8/8/1N6 w HAha - 0 1');


let PiecesImages = [];
let ChessSounds = [];
//https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces
//kK/qQ/rR/nN/bB/pP//
function LoadPieces(){
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
function LoadSounds(soundSet){
	ChessSounds.push(new Audio());
	ChessSounds[0].src = `/sounds/${soundSet}/move.wav`;
	ChessSounds.push(new Audio());
	ChessSounds[1].src = `/sounds/${soundSet}/capture.wav`;
	ChessSounds.push(new Audio());
	ChessSounds[2].src = `/sounds/${soundSet}/castle.wav`;
	ChessSounds.push(new Audio());
	ChessSounds[3].src = `/sounds/${soundSet}/game-start.wav`;
	ChessSounds.push(new Audio());
	ChessSounds[3].src = `/sounds/${soundSet}/game-end.wav`;
}

LoadPieces();
LoadSounds("chesscom");
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
        Start();
    }
}

var DisplayPosition = StartingPosition.slice();
setCurrentPosition(StartingPosition.slice());

function Start(){
	SetPieceImages(PiecesImages);
	SetChessSounds(ChessSounds);
	drawChessBoard(DisplayPosition);
	GameState.legalMoves = GetLegalMoves(GameState.position);
}

document.addEventListener('keydown', (event) => {
	if(event.key == 'e') toggleEditMode();
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
	editColorToggle.innerHTML = appState.editWhiteMode ? "white" : "black";
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

