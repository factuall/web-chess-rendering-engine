import {DEBUG_SHOW_NUMBERS, DEBUG_SHOWPOS_ONHOVER, APPLY_CHESS_RULES, CurrentPosition, ShowPositionSideCharacters, GameState, playerMoved, kingMoved, rookMoved, getGameState, getAppState, setGameState} from "./globals.js";
import { gameStateToFEN, getPossiblePieceMoves, indexToCoords, getLegalMoves, isPieceWhite, performMove } from "./chess-utils.js";
import { historyAppend } from "./side-menu.js";

let SquareSize = 100;
let PieceSize = 98;
let ColorSquareWhite = '#f0d9b5';
let ColorSquareBlack = '#b58863';
let ColorDestination = "rgba(0, 0, 0, 0.49)"
let ColorPingArrow = "rgba(81, 221, 90, 0.7)";
let ColorPingArrowAlt = "rgba(221, 81, 81, 0.7)";
let ColorPingSquare = "rgba(221, 165, 81, 0.7)";
let PiecesImages = [];
let ChessSounds = [];
let DisplayPosition = [];
let boardFlipped = false; 

const CANVAS = document.getElementById("board-canvas");

const CTX = CANVAS.getContext("2d");

export function SetPieceImages(images){
    PiecesImages = images;
}

export function SetChessSounds(sounds){
    ChessSounds = sounds;
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

function drawCircle(x, y, r, fillColor, strokeColor, strokeWidth){
    CTX.beginPath();
    CTX.arc(x, y, r, 0, 2 * Math.PI);
    if(fillColor != ''){
        CTX.fillStyle = fillColor;
        CTX.fill();
    }
    
    if(strokeColor != '' && strokeWidth != 0){
        CTX.strokeStyle = strokeColor;
        CTX.stroke();
    }
    CTX.stroke();
}

export function drawLineAbs(xFrom, yFrom, xTo, yTo, lineWidth, color){
    CTX.lineWidth = lineWidth;
    CTX.strokeStyle = color;
    CTX.beginPath();
    CTX.moveTo(xFrom, yFrom);
    CTX.lineTo(xTo, yTo);
    CTX.stroke();
}

//stolen from StackOverflow with slight modifications to match my case
function drawArrow(fromx, fromy, tox, toy){
    //letiables to be used when creating the arrow
    let width = SquareSize / 8;
    let headlen = SquareSize / 3;
    let angle = Math.atan2(toy-fromy,tox-fromx);
    // This makes it so the end of the arrow head is located at tox, toy, don't ask where 1.15 comes from
    tox -= Math.cos(angle) * ((width*1.15));
    toy -= Math.sin(angle) * ((width*1.15));

    
    //starting path of the arrow from the start square to the end square and drawing the stroke
    
    let triSidePointOne = {x: tox-headlen*Math.cos(angle-Math.PI/7), y: toy-headlen*Math.sin(angle-Math.PI/7)};
    let triSidePointTwo = {x: tox-headlen*Math.cos(angle+Math.PI/7), y: toy-headlen*Math.sin(angle+Math.PI/7)};
    let middlePoint = {x: (triSidePointOne.x + triSidePointTwo.x) / 2, y: (triSidePointOne.y + triSidePointTwo.y) / 2};

    CTX.beginPath();
    CTX.moveTo(fromx, fromy);
    CTX.lineTo(middlePoint.x, middlePoint.y);
    CTX.strokeStyle = ColorPingArrow;
    CTX.lineWidth = width;
    CTX.stroke();
    
    //starting a new path from the head of the arrow to one of the sides of the point
    CTX.beginPath();
    CTX.moveTo(tox, toy);
    CTX.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));
    
    //path from the side point of the arrow, to the other side point
    CTX.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),toy-headlen*Math.sin(angle+Math.PI/7));
    
    //path from the side point back to the tip of the arrow, and then again to the opposite side point
    CTX.lineTo(tox, toy);
    CTX.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));

    //draws the paths created above
    CTX.strokeStyle = ColorPingArrow;
    CTX.lineWidth = 1;
    CTX.stroke();
    CTX.fillStyle = ColorPingArrow;
    CTX.fill();

    CTX.lineWidth = 1; //reset the line width
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

//{x, y}, {x, y}
function drawPing(from, to){
    let sizeX = Math.abs(from.x - to.x);
    let sizeY = Math.abs(from.y - to.y);
    if(from.x == to.x && from.y == to.y){//square ping
        let absFrom = {
            x: (from.x * SquareSize),
            y: (from.y * SquareSize)};
        DrawSquare(absFrom.x, absFrom.y, SquareSize, SquareSize, ColorPingSquare);
    }else{//arrow ping
        let absFrom = {
            x: (from.x * SquareSize) + SquareSize/2,
            y: (from.y * SquareSize) + SquareSize/2};
        let absTo = {
            x: (to.x * SquareSize) + SquareSize/2, 
            y: (to.y * SquareSize) + SquareSize/2};
        drawArrow(absFrom.x, absFrom.y, absTo.x, absTo.y);
        //drawLineAbs(absFrom.x, absFrom.y, absTo.x, absTo.y, thickness, ColorArrow);
        //if(!(sizeX == 3 && sizeY == 2) || (sizeX == 2 && sizeY == 3)){ //knight arrow
        
    }

}

export function drawChessBoard(position){
    DisplayPosition = position.slice();
    drawBoard(boardFlipped);
    drawPieces(position, boardFlipped);
    if(pieceHeldIndex != -1){
        drawDestinations(pieceHeldMoves, boardFlipped);

    }
    pingSquaresToDraw.forEach((square) => {
        drawPing(square[0], square[1]);
    });
    pingArrowsToDraw.forEach((arrow) => {
        drawPing(arrow[0], arrow[1]);
    });
    if(pingFrom.x != -1 && (pingFrom.x != pingTo.x || pingFrom.y != pingTo.y )){
        drawPing(pingFrom, pingTo);
    }
    //drawPingArrow({x: 1, y: 0}, {x: 0, y: 0});
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
                (squareIndex % 2 === 0 ? ColorSquareBlack : ColorSquareWhite) : (squareIndex % 2 === 0 ? ColorSquareWhite : ColorSquareBlack)
            );

            if(DEBUG_SHOW_NUMBERS)
            DrawText(
                (posX * SquareSize) + 2, 
                (posY * SquareSize) + SquareSize - 2,
                'large',
                'black',
                boardFlipped ? 63 - squareIndex : squareIndex 
            );

            let isDebugSquare = (DEBUG_SHOWPOS_ONHOVER && posX === mouseSq.x && posY === mouseSq.y);
            if((posY === 7 && ShowPositionSideCharacters) || isDebugSquare){ //draw letters at the bottom of the board
                DrawText(
                    (posX * SquareSize) + 84, 
                    (posY * SquareSize) + SquareSize - 4,
                    '25px',
                    posY % 2 != 0 ? 
                    (squareIndex % 2 === 0 ? ColorSquareWhite : ColorSquareBlack) : (squareIndex % 2 === 0 ? ColorSquareBlack : ColorSquareWhite),
                    flipped ? String.fromCharCode(104 - posX) : String.fromCharCode(97 + posX)
                );
            }
            
            if((posX === 0 && ShowPositionSideCharacters) || isDebugSquare){ //draw numbers on the left side of the board
                DrawText(
                    (posX * SquareSize) + 2, 
                    (posY * SquareSize) + 22,
                    '25px',
                    posY % 2 != 0 ? 
                    (squareIndex % 2 === 0 ? ColorSquareWhite : ColorSquareBlack) : (squareIndex % 2 === 0 ? ColorSquareBlack : ColorSquareWhite),
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

function drawDestinations(moves, flipped){
    for (let i = 0; i < moves.length; i++) {
        let to = moves[i].to;
        if(flipped) to = 63-to;
        let pos = indexToCoords(to);
        drawCircle(pos.x * SquareSize + (SquareSize / 2), pos.y * SquareSize + (SquareSize / 2), SquareSize/4, ColorDestination, ColorDestination, 4);
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
let pieceHeldIndex = -1;
let pieceHeldMoves = [];

let rerender = false; //set true if next mouse update needs board rerendered 
let ignoreMOne = false; //used to prevent user from pressing m1 on empty square, moving to another square and then getting a piece grabbed 
function updateMousePosition(event){
    let dot, eventDoc, doc, body, pageX, pageY;
	let rect = CANVAS.getBoundingClientRect();
    event = event || window.event; // IE-ism

    // If pageX/Y aren't available and clientX/Y are,
    // calculate pageX/Y - logic taken from jQuery.
    // (This is to support old IE)
    if (event.pageX === null && event.clientX != null) {
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

    updateMouse();
}

let pingFrom = {x: -1, y: -1};
let pingTo = {x: -1, y: -1};
let pingArrowsToDraw = [];
let pingSquaresToDraw = [];
function updateMouse(){
    if(mouseOneDown && (pingArrowsToDraw.length > 0 || pingSquaresToDraw.length > 0)){
        pingArrowsToDraw = [];
        pingSquaresToDraw = [];
        rerender = true;
    } 

	if(rerender == true){
		drawChessBoard(DisplayPosition);
		rerender = false;
	}

	let mSqX = Math.floor(mouse.x / SquareSize);
	let mSqY = Math.floor(mouse.y / SquareSize);

	if((mSqX != mouseSq.x || mSqY != mouseSq.y) && DEBUG_SHOWPOS_ONHOVER) rerender = true;

	mouseSq.x = mSqX;
	mouseSq.y = mSqY;

    let mIndex = (mSqX + (mSqY * 8));

	if(mSqX < 0 || mSqX > 7 || mSqY < 0 || mSqY > 7) return;
    if(boardFlipped) mIndex = 63-mIndex;
    let gs = getGameState();
    let appState = getAppState();
    if(appState.editMode){
        if(mouseOneDown){
            switch(appState.editIndex){
                case 0:
                    gs.position[mIndex] = 'x';
                    break;                  
                case 2:
                    gs.position[mIndex] = appState.editWhiteMode ? 'K' : 'k';
                    break;
                case 3:
                    gs.position[mIndex] = appState.editWhiteMode ? 'Q' : 'q';
                    break;
                case 4:
                    gs.position[mIndex] = appState.editWhiteMode ? 'R' : 'r';
                    break;
                case 5:
                    gs.position[mIndex] = appState.editWhiteMode ? 'B' : 'b';
                    break;
                case 6:
                    gs.position[mIndex] = appState.editWhiteMode ? 'N' : 'n';
                    break;
                case 7:
                    gs.position[mIndex] = appState.editWhiteMode ? 'P' : 'p';
                    break;
            }
            DisplayPosition = gs.position.slice();
            gs.legalMoves = getLegalMoves(gs.position);
            drawChessBoard(DisplayPosition);
            updateFenBar();
        }

        if(mouseTwoDown){
            gs.position[mIndex] = 'x';
            DisplayPosition = gs.position.slice();
            gs.legalMoves = getLegalMoves(gs.position);
            drawChessBoard(DisplayPosition);
            updateFenBar();
        }

        if(appState.editIndex === 1){
            if(pieceHeldIndex === -1){ //no piece held
                if(mouseOneDown){
                    if(GameState.position[mIndex] != 'x' && !ignoreMOne){
                        DisplayPosition[mIndex] = 'x';
                        pieceHeldIndex = mIndex;
                        pieceHeldMoves = [];
                        for (let move = 0; move < GameState.legalMoves.length; move++) {
                            if(GameState.legalMoves[move].from === pieceHeldIndex)
                                pieceHeldMoves.push(GameState.legalMoves[move]);
                        }
                        drawChessBoard(DisplayPosition);
                        DrawPieceAbs(mouse.x - (PieceSize/2), mouse.y - (PieceSize/2), GameState.position[pieceHeldIndex]);
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
                    let isLegalMove = false;
                    let isCapture = false;
                    let selectedMove;
                    for (let i = 0; i < gs.legalMoves.length; i++) {
                        if( gs.legalMoves[i].from === pieceHeldIndex &&
                            gs.legalMoves[i].to === mIndex){
                            isLegalMove = true;
                            selectedMove = gs.legalMoves[i];
                            if(gs.legalMoves[i].isCapture) isCapture = true;
                            break;
                        }
                    }
    
                    GameState.position[mIndex] = GameState.position[pieceHeldIndex];
                    if(mIndex != pieceHeldIndex)GameState.position[pieceHeldIndex] = 'x';
                    GameState.legalMoves = getLegalMoves(GameState.position);
                    
                    DisplayPosition = GameState.position.slice();
                    pieceHeldIndex = -1;
                    drawChessBoard(DisplayPosition);
                    updateFenBar();
                    
                }else{
                    DrawPieceAbs(mouse.x - (PieceSize/2), mouse.y - (PieceSize/2), GameState.position[pieceHeldIndex]);
                    rerender = true;
                }
            }
        }

        return;
    }
	if(pieceHeldIndex === -1){ //no piece held
		if(mouseOneDown){
			if(GameState.position[mIndex] != 'x' && !ignoreMOne){
				DisplayPosition[mIndex] = 'x';
				pieceHeldIndex = mIndex;
                pieceHeldMoves = [];
                for (let move = 0; move < GameState.legalMoves.length; move++) {
                    if(GameState.legalMoves[move].from === pieceHeldIndex)
                        pieceHeldMoves.push(GameState.legalMoves[move]);
                }
				drawChessBoard(DisplayPosition);
				DrawPieceAbs(mouse.x - (PieceSize/2), mouse.y - (PieceSize/2), GameState.position[pieceHeldIndex]);
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
            let isLegalMove = false;
            let isCapture = false;
            let selectedMove;
            for (let i = 0; i < gs.legalMoves.length; i++) {
                if( gs.legalMoves[i].from === pieceHeldIndex &&
                    gs.legalMoves[i].to === mIndex){
                    isLegalMove = true;
                    selectedMove = gs.legalMoves[i];
                    if(gs.legalMoves[i].isCapture) isCapture = true;
                    break;
                }
            }
            if(isLegalMove){
                gs.whiteMoves = !gs.whiteMoves;
                if(isCapture) 
                    ChessSounds[1].play();
                else 
                    ChessSounds[0].play();
                
                if(selectedMove.isCastleK || selectedMove.isCastleQ) ChessSounds[2].play();
                
                performMove(gs, selectedMove);
                gs.legalMoves = getLegalMoves(gs);
                gs.moveHistory.push({position: gs.position, move: selectedMove});
                historyAppend({position: gs.position, move: selectedMove});
                console.log(gs.moveHistory);
            }
            DisplayPosition = gs.position.slice();
            pieceHeldIndex = -1;
            drawChessBoard(DisplayPosition);
			updateFenBar();
			
		}else{
			DrawPieceAbs(mouse.x - (PieceSize/2), mouse.y - (PieceSize/2), gs.position[pieceHeldIndex]);
			rerender = true;
		}
	}

    //pinging - adding arrows to the list
    if(mouseTwoDown){
        if(pingFrom.x == -1){
            pingFrom.x = mSqX;
            pingFrom.y = mSqY;
        }
        pingTo.x = mSqX;
        pingTo.y = mSqY;
        rerender = true;
    }
    if(!mouseTwoDown && pingFrom.x != -1){
        pingTo.x = mSqX;
        pingTo.y = mSqY;
        let newArrow = true;
        for (let aI = 0; aI < pingArrowsToDraw.length; aI++) { //removing the arrow if trying to draw two at the same origin and destination
            if(pingArrowsToDraw[aI][0].x == pingFrom.x &&
                pingArrowsToDraw[aI][0].y == pingFrom.y &&
                pingArrowsToDraw[aI][1].x == pingTo.x &&
                pingArrowsToDraw[aI][1].y == pingTo.y 
            ){ 
                newArrow = false;
                pingArrowsToDraw.splice(aI, 1);
            }
        } 
        if(newArrow)
            if(pingFrom.x == pingTo.x && pingFrom.y == pingTo.y){
                pingSquaresToDraw.push([
                    {x: pingFrom.x, y: pingFrom.y},
                    {x: pingTo.x, y: pingTo.y}
                ]);
            }else{
                pingArrowsToDraw.push([
                    {x: pingFrom.x, y: pingFrom.y},
                    {x: pingTo.x, y: pingTo.y}
                ]);
            }
        pingFrom.x = -1;
        drawChessBoard(DisplayPosition);
    }

}

CANVAS.addEventListener('mousedown', function(event){
    if(event.button === 0){
        mouseOneDown = true;
    }else{
        mouseTwoDown = true;
    }
    updateMouse();
});

CANVAS.addEventListener('mouseup', function(event){
    if(event.button === 0){
        mouseOneDown = false;
    }else{
        mouseTwoDown = false;
    }
    updateMouse();
});

let FenInput = document.getElementById("fen-input");
function applyFen(){
	setCurrentPosition(InterpretFen(FenInput.value));
	DisplayPosition = GameState.position.slice();
	drawChessBoard(DisplayPosition);
}

function updateFenBar(){
    if(FenInput != null)
	FenInput.value = gameStateToFEN(getGameState());
}

document.addEventListener('keydown', (event) => {
    if(event.key === 'f') boardFlipped = !boardFlipped;
    drawChessBoard(DisplayPosition);
    if(event.key === 'x') getPossiblePieceMoves(GameState.position, 9);
});

export function resizeBoard(sizePx){
    CANVAS.width = sizePx;
    CANVAS.height = sizePx;
    SquareSize = sizePx/8;
    PieceSize = SquareSize-2;
    drawChessBoard(DisplayPosition);
}