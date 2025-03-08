import {DEBUG_SHOWPOS_ONHOVER, SquareSize, PieceSize, CurrentPosition, setCurrentPosition} from "./globals.js"
import {InterpretFen, PositionToFen} from "./chess-utils.js"
import { SetPieceImages, drawChessBoard } from "./board.js"

//PUBLIC FLAGS
var whiteMoves = true;

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


let PiecesImages = [];
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

LoadPieces();
var len = PiecesImages.length,
    counter = 0;

[].forEach.call( PiecesImages, function( img ) {
    if(img.complete)
      incrementCounter();
    else
      img.addEventListener( 'load', incrementCounter, false );
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
	drawChessBoard(DisplayPosition);
	PositionToFen(CurrentPosition);
}
