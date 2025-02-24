//DEBUG FLAGS
const DebugShowNumbers = false;
const DebugShowPosOnHover = true;
const ApplyRules = true; 

//PUBLIC FLAGS
var boardFlipped = true; // !TODO!

const canvas = document.getElementById("board-canvas");

const ctx = canvas.getContext("2d");

// load the "Bitter" font from Google Fonts
const fontRobotoFile = new FontFace(
	"Roboto",
	"url(/fonts/Roboto-Regular.ttf)",
  );
document.fonts.add(fontRobotoFile);

const mouse = {x: 0, y: 0};
const mouseAbsolute = {x: 0, y: 0};
const mouseSq = {x: 0, y: 0};
var SquareSize = 100;
var PieceSize = 98;
var ColorSquareWhite = '#f0d9b5';
var ColorSquareBlack = '#b58863';
let StartingPosition = InterpretFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
let TwokingsPosition = InterpretFen('3k4/8/8/8/8/4K3/8/8 w KQkq - 0 1');
var PiecesImages = [];

function DrawSquare(x, y, w, h, color){
	ctx.fillStyle = color;
	ctx.fillRect(x, y, w, h);
}

function DrawImage(x, y, w, h, image){
	ctx.drawImage(image, x, y, w, h);
}

function DrawText(x, y, size, color, text) {
	ctx.font = `${size} "Roboto"`;
	ctx.fillStyle = color;
	ctx.fillText(text, x, y);
}

function SquareIndexToPosition(index){
	let position = "";
	
	let column =  //Math.ceil(index /  )// index-((Math.floor((index)/8)*8));
	position += column;//
	return position;
}

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

function DrawPiece(sqX, sqY, piece){
	DrawPieceAbs(sqX * SquareSize, sqY*SquareSize, piece);
}
function DrawPieceAbs(x, y, piece){
	let pieceImage;
	switch(piece){
		case 'k':
			DrawImage(x, y, PieceSize, PieceSize, PiecesImages[0]);
			break;
		case 'K':
			DrawImage(x, y, PieceSize, PieceSize, PiecesImages[1]);
			break;
		case 'q':
			DrawImage(x, y, PieceSize, PieceSize, PiecesImages[2]);
			break;
		case 'Q':
			DrawImage(x, y, PieceSize, PieceSize, PiecesImages[3]);
			break;
		case 'r':
			DrawImage(x, y, PieceSize, PieceSize, PiecesImages[4]);
			break;
		case 'R':
			DrawImage(x, y, PieceSize, PieceSize, PiecesImages[5]);
			break;
		case 'n':
			DrawImage(x, y, PieceSize, PieceSize, PiecesImages[6]);
			break;
		case 'N':
			DrawImage(x, y, PieceSize, PieceSize, PiecesImages[7]);
			break;
		case 'b':
			DrawImage(x, y, PieceSize, PieceSize, PiecesImages[8]);
			break;
		case 'B':
			DrawImage(x, y, PieceSize, PieceSize, PiecesImages[9]);
			break;
		case 'p':
			DrawImage(x, y, PieceSize, PieceSize, PiecesImages[10]);
			break;
		case 'P':
			DrawImage(x, y, PieceSize, PieceSize, PiecesImages[11]);
			break;

	}
}

function InterpretFen(notation){
	let positions = [];
	let ntFragments = notation.split(" ");
	let rows = ntFragments[0].split("/");

	for (let row = 0; row < rows.length; row++) {
		let tokens = rows[row].split("");
		for (let token = 0; token < tokens.length; token++) {

			var tokenNum = parseInt(tokens[token]);
			if(!isNaN(tokenNum) && tokens[token] === '' + tokenNum){ //number token
				for (let i = 0; i < tokens[token]; i++) {
					positions.push('x');	
				}
			}else{ //letter token
					positions.push(tokens[token]);
			}
		}
	}
	return positions;
}

function PositionToFen(position){
	let fen = "";
	for (let posY = 0; posY < 8; posY++) {
		
		let emptyCounter = 0;
		for (let posX = 0; posX < 8; posX++) {
			let offset = posX + (posY * 8);
			if(position[offset] == 'x'){
				emptyCounter++;
				if(posX < 7 ){
					if(position[offset+1] != 'x'){
						fen += emptyCounter;
						emptyCounter = 0;
					}
				}
				else{
					fen += emptyCounter;
					emptyCounter = 0;
				}
			}
			else {
				if(emptyCounter > 0){
					fen += emptyCounter;
					emptyCounter = 0;
				}
				fen += position[offset]	
			}
		}
		if(posY < 7) fen += '/';
	}
	fen += " !TODO!";
	return fen;
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

function drawChessBoard(position){
	let squareIndex = 0;
	for (let posY = 0; posY < 8; posY++) {
		for (let posX = 0; posX < 8; posX++) {
			DrawSquare(
				posX * SquareSize, 
				posY * SquareSize,
				SquareSize,
				SquareSize,
				posY % 2 != 0 ? 
				(squareIndex % 2 == 0 ? ColorSquareBlack : ColorSquareWhite) : (squareIndex % 2 == 0 ? ColorSquareWhite : ColorSquareBlack)
			);

			if(DebugShowNumbers)
			DrawText(
				(posX * SquareSize) + 2, 
				(posY * SquareSize) + SquareSize - 2,
				'large',
				'black',
				squareIndex
			);
			
			let isDebugSquare = (DebugShowPosOnHover && posX == mouseSq.x && posY == mouseSq.y);
			if(posY == 7 || isDebugSquare){ //draw letters at the bottom of the board
				DrawText(
					(posX * SquareSize) + 84, 
					(posY * SquareSize) + SquareSize - 4,
					'25px',
					posY % 2 != 0 ? 
					(squareIndex % 2 == 0 ? ColorSquareWhite : ColorSquareBlack) : (squareIndex % 2 == 0 ? ColorSquareBlack : ColorSquareWhite),
					String.fromCharCode(97 + posX)
				);
			}
			
			if(posX == 0 || isDebugSquare){ //draw numbers on the left side of the board
				DrawText(
					(posX * SquareSize) + 2, 
					(posY * SquareSize) + 22,
					'25px',
					posY % 2 != 0 ? 
					(squareIndex % 2 == 0 ? ColorSquareWhite : ColorSquareBlack) : (squareIndex % 2 == 0 ? ColorSquareBlack : ColorSquareWhite),
					posY + 1
				);
			}

			if(position[squareIndex] != 'x'){//draw a piece if anything's there
				DrawPiece(posX, posY, position[squareIndex])
			}
			squareIndex++;
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
	let rect = canvas.getBoundingClientRect();
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

	if((mSqX != mouseSq.x || mSqY != mouseSq.y) && DebugShowPosOnHover) rerender = true;

	mouseSq.x = mSqX;
	mouseSq.y = mSqY;



	let mIndex = (mSqX + (mSqY * 8));

	if(mSqX < 0 || mSqX > 7 || mSqY < 0 || mSqY > 7) return;
	
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
	
}

canvas.addEventListener('mousedown', function(event){
    if(event.button === 0){
        mouseOneDown = true;
    }else{
        mouseTwoDown = true;
    }
});

canvas.addEventListener('mouseup', function(event){
    if(event.button === 0){
        mouseOneDown = false;
    }else{
        mouseTwoDown = false;
    }
});
