import {DEBUG_SHOW_NUMBERS, DEBUG_SHOWPOS_ONHOVER, APPLY_CHESS_RULES} from "./globals.js";

var SquareSize = 100;
var PieceSize = 98;
var ColorSquareWhite = '#f0d9b5';
var ColorSquareBlack = '#b58863';
var PiecesImages = [];

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
            
            /*let isDebugSquare = (DEBUG_SHOWPOS_ONHOVER && posX == mouseSq.x && posY == mouseSq.y);
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
            }*/

            if(position[squareIndex] != 'x'){//draw a piece if anything's there
                DrawPiece(posX, posY, position[squareIndex])
            }
            squareIndex++;
        }
        
    }
}