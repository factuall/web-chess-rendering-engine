import {DEBUG_SHOW_NUMBERS, DEBUG_SHOWPOS_ONHOVER, APPLY_CHESS_RULES, CurrentPosition, ShowPositionSideCharacters} from "./globals.js";
import { PositionToFen } from "./chess-utils.js";

var SquareSize = 100;
var PieceSize = 98;
var ColorSquareWhite = '#f0d9b5';
var ColorSquareBlack = '#b58863';
var PiecesImages = [];
var DisplayPosition = [];
var boardFlipped = false; 

const CANVAS = document.getElementById("board-canvas");

const CTX = CANVAS.getContext("2d");

export function SetPieceImages(images){
    PiecesImages = images;
}

function DrawSquare(x, y, w, h, color){
	CTX.fillStyle = color;
	CTX.fillRect(x, y, w, h);
}

function DrawImage(x, y, w, h, image){
	CTX.drawImage(image, x, y, w, h);
}

function DrawText(x, y, size, color, text) {
	CTX.font = `${size} "Roboto"`;
	CTX.fillStyle = color;
	CTX.fillText(text, x, y);
}

export function DrawPiece(sqX, sqY, piece){
    DrawPieceAbs(sqX * SquareSize, sqY*SquareSize, piece);
}
export function DrawPieceAbs(x, y, piece){
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

export function drawChessBoard(position){
    DisplayPosition = position.slice();
    drawBoard(boardFlipped);
    drawPieces(position, boardFlipped);
}

function drawBoard(flipped){
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

            if(DEBUG_SHOW_NUMBERS)
            DrawText(
                (posX * SquareSize) + 2, 
                (posY * SquareSize) + SquareSize - 2,
                'large',
                'black',
                squareIndex
            );

            let isDebugSquare = (DEBUG_SHOWPOS_ONHOVER && posX == mouseSq.x && posY == mouseSq.y);
            if((posY == 7 && ShowPositionSideCharacters) || isDebugSquare){ //draw letters at the bottom of the board
                DrawText(
                    (posX * SquareSize) + 84, 
                    (posY * SquareSize) + SquareSize - 4,
                    '25px',
                    posY % 2 != 0 ? 
                    (squareIndex % 2 == 0 ? ColorSquareWhite : ColorSquareBlack) : (squareIndex % 2 == 0 ? ColorSquareBlack : ColorSquareWhite),
                    flipped ? String.fromCharCode(104 - posX) : String.fromCharCode(97 + posX)
                );
            }
            
            if((posX == 0 && ShowPositionSideCharacters) || isDebugSquare){ //draw numbers on the left side of the board
                DrawText(
                    (posX * SquareSize) + 2, 
                    (posY * SquareSize) + 22,
                    '25px',
                    posY % 2 != 0 ? 
                    (squareIndex % 2 == 0 ? ColorSquareWhite : ColorSquareBlack) : (squareIndex % 2 == 0 ? ColorSquareBlack : ColorSquareWhite),
                    flipped ? 1 + posY : 8 - posY
                );
            }
            squareIndex++;
        }
        
    }


}

function drawPieces(position, flipped){
    let squareIndex = 0;
    let loopDirection = flipped ? -1 : 1;
    for (let posY = 0; posY < 8; posY++) {
        for (let posX = 0; posX < 8; posX++) {
            if(position[squareIndex] != 'x'){//draw a piece if anything's there
                if(boardFlipped)
                    DrawPiece(7 - posX, 7 - posY, position[squareIndex]);
                else
                    DrawPiece(posX, posY, position[squareIndex]);
                
            }
            squareIndex++;
        }
    }
}

document.onmousemove = updateMousePosition;
window.addEventListener('contextmenu', function (e) { 
    e.preventDefault(); 
}, false);


const mouse = {x: 0, y: 0};
const mouseAbsolute = {x: 0, y: 0};
const mouseSq = {x: 0, y: 0};
let mouseOneDown = false;
let mouseTwoDown = false;
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
	
    if(boardFlipped) mIndex = 63-mIndex;
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

let FenInput = document.getElementById("fen-input");
function ApplyFen(){
	setCurrentPosition(InterpretFen(FenInput.value));
	DisplayPosition = CurrentPosition.slice();
	drawChessBoard(DisplayPosition);
}

function UpdateFenBar(){
    if(FenInput != null)
	FenInput.value = PositionToFen(CurrentPosition);
}

document.addEventListener('keydown', (event) => {
    if(event.key == 'f') boardFlipped = !boardFlipped;
    drawChessBoard(DisplayPosition);
});