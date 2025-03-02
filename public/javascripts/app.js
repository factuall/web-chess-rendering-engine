import {InterpretFen, PositionToFen} from "./chess-utils.js"
import { SetPieceImages, drawChessBoard } from "./board-drawing.js"
import {DEBUG_SHOWPOS_ONHOVER, SquareSize, PieceSize} from "./globals.js"
//DEBUG FLAGS


//PUBLIC FLAGS
var boardFlipped = true; // !TODO!
var whiteMoves = true;

const CANVAS = document.getElementById("board-canvas");

const CTX = CANVAS.getContext("2d");

// load the "Bitter" font from Google Fonts
const fontRobotoFile = new FontFace(
	"Roboto",
	"url(/fonts/Roboto-Regular.ttf)",
  );
document.fonts.add(fontRobotoFile);

const mouse = {x: 0, y: 0};
const mouseAbsolute = {x: 0, y: 0};
const mouseSq = {x: 0, y: 0};

let StartingPosition = InterpretFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
let TwokingsPosition = InterpretFen('3k4/8/8/8/8/4K3/8/8 w KQkq - 0 1');


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



let FenInput = document.getElementById("fen-input");
function ApplyFen(){
	CurrentPosition = InterpretFen(FenInput.value);
	DisplayPosition = CurrentPosition.slice();
	drawChessBoard(DisplayPosition);
}

function UpdateFenBar(){
	FenInput.value = PositionToFen(CurrentPosition);
}

//credit for idea/function: Sebastian Lague
var SqDirectionOffsets = [-8, 8, -1, 1, -7, 7, -9, 9]; // north, south, west, east, nw, sw, ne, se
var SqEdgeDistances = [];
function PrecomputeEdgeDistances(){
	SqEdgeDistances = [];
	for (let posY = 0; posY < 8; posY++) {
		for (let posX = 0; posX < 8; posX++) {
			let numNorth = posY;
			let numSouth = 7 - posY;
			let numWest = posX;
			let numEast = 7 - posX;

			SqEdgeDistances.push([
				numNorth,
				numSouth,
				numWest,
				numEast
			]);
		}
	}
}
PrecomputeEdgeDistances();
console.log(SqEdgeDistances);

function GetPossibleMoves(position){
	let positionMoves = [];
	for (let posY = 0; posY < 8; posY++) {
		for (let posX = 0; posX < 8; posX++) {
			let posIndex = (posY * 8) + posX;
			if(posIndex[posIndex] != 'x'){
				let moves = [];
				if(posIndex[posIndex] === posIndex[posIndex].toUpperCase() && whiteMoves){
					//white piece & white moves - check its moves
				}else if(posIndex[posIndex] === posIndex[posIndex].toLowerCase() && !whiteMoves){
					//black piece & black moves - check its moves
				}
				positionMoves.push(moves)
			}
		}
	}
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

let mouseOneDown = false;
let mouseTwoDown = false;

document.onmousemove = updateMousePosition;
window.addEventListener('contextmenu', function (e) { 
    e.preventDefault(); 
}, false);

var DisplayPosition = StartingPosition.slice();
var CurrentPosition = StartingPosition.slice();

function Start(){
	SetPieceImages(PiecesImages);
	drawChessBoard(DisplayPosition);
	PositionToFen(CurrentPosition);
}

let PieceHeldIndex = -1;
let PieceHeld = '';

let rerender = false; //set true if next mouse update needs board rerendered 
let ignoreMOne = false; //used to prevent user from pressing m1 on empty square, moving to another square and then getting a piece grabbed 
function updateMousePosition(event){
	if(rerender = true){
		drawChessBoard(DisplayPosition);
		rerender = false;
	}
	
    var dot, eventDoc, doc, body, pageX, pageY;
	let rect = CANVAS.getBoundingClientRect();
    event = event || window.event; // IE-ism

    // If pageX/Y aren't available and clientX/Y are,
    // calculate pageX/Y - logic taken from jQuery.
    // (This is to support old IE)
    if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
            (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
            (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
            (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
            (doc && doc.clientTop  || body && body.clientTop  || 0 );
    }

    mouseAbsolute.x = event.pageX;
    mouseAbsolute.y = event.pageY;

    mouse.x = event.pageX - rect.left;
    mouse.y = event.pageY - rect.top;

	let mSqX = Math.floor(mouse.x / SquareSize);
	let mSqY = Math.floor(mouse.y / SquareSize);

	if((mSqX != mouseSq.x || mSqY != mouseSq.y) && DEBUG_SHOWPOS_ONHOVER) rerender = true;

	mouseSq.x = mSqX;
	mouseSq.y = mSqY;



	let mIndex = (mSqX + (mSqY * 8));

	if(mSqX < 0 || mSqX > 7 || mSqY < 0 || mSqY > 7) return;
	
	/*
	if(PieceHeldIndex == -1){ //no piece held
		if(mouseOneDown){
			if(CurrentPosition[mIndex] != 'x' && !ignoreMOne){
				DisplayPosition[mIndex] = 'x';
				PieceHeldIndex = mIndex;
				drawChessBoard(DisplayPosition);
				DrawPieceAbs(mouse.x - (PieceSize/2), mouse.y - (PieceSize/2), CurrentPosition[PieceHeldIndex]);
				rerender = true;
			}
			else{
				ignoreMOne = true;
			}
		}
		else{
			ignoreMOne = false;
		}
		
	}else{//piece held
		if(!mouseOneDown){
			CurrentPosition[mIndex] = CurrentPosition[PieceHeldIndex];
			if(mIndex != PieceHeldIndex)CurrentPosition[PieceHeldIndex] = 'x';
			DisplayPosition = CurrentPosition.slice();
			drawChessBoard(DisplayPosition);
			PieceHeldIndex = -1;
			UpdateFenBar();
			
		}else{
			DrawPieceAbs(mouse.x - (PieceSize/2), mouse.y - (PieceSize/2), CurrentPosition[PieceHeldIndex]);
			rerender = true;
		}
	}
	*/
}

CANVAS.addEventListener('mousedown', function(event){
    if(event.button === 0){
        mouseOneDown = true;
    }else{
        mouseTwoDown = true;
    }
});

CANVAS.addEventListener('mouseup', function(event){
    if(event.button === 0){
        mouseOneDown = false;
    }else{
        mouseTwoDown = false;
    }
});
