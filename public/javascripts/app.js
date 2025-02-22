// App js


const canvas = document.getElementById("board-canvas");
const ctx = canvas.getContext("2d");

// load the "Bitter" font from Google Fonts
const fontRobotoFile = new FontFace(
	"Roboto",
	"url(/fonts/Roboto-Regular.ttf)",
  );
document.fonts.add(fontRobotoFile);

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

var SquareSize = 100;
var PieceSize = 98;
var ColorSquareWhite = '#f0d9b5';
var ColorSquareBlack = '#b58863';

var PiecesImages = [];
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
	let pieceImage;
	switch(piece){
		case 'k':
			DrawImage(sqX * SquareSize, sqY * SquareSize, PieceSize, PieceSize, PiecesImages[0]);
			break;
		case 'K':
			DrawImage(sqX * SquareSize, sqY * SquareSize, PieceSize, PieceSize, PiecesImages[1]);
			break;
		case 'q':
			DrawImage(sqX * SquareSize, sqY * SquareSize, PieceSize, PieceSize, PiecesImages[2]);
			break;
		case 'Q':
			DrawImage(sqX * SquareSize, sqY * SquareSize, PieceSize, PieceSize, PiecesImages[3]);
			break;
		case 'r':
			DrawImage(sqX * SquareSize, sqY * SquareSize, PieceSize, PieceSize, PiecesImages[4]);
			break;
		case 'R':
			DrawImage(sqX * SquareSize, sqY * SquareSize, PieceSize, PieceSize, PiecesImages[5]);
			break;
		case 'n':
			DrawImage(sqX * SquareSize, sqY * SquareSize, PieceSize, PieceSize, PiecesImages[6]);
			break;
		case 'N':
			DrawImage(sqX * SquareSize, sqY * SquareSize, PieceSize, PieceSize, PiecesImages[7]);
			break;
		case 'b':
			DrawImage(sqX * SquareSize, sqY * SquareSize, PieceSize, PieceSize, PiecesImages[8]);
			break;
		case 'B':
			DrawImage(sqX * SquareSize, sqY * SquareSize, PieceSize, PieceSize, PiecesImages[9]);
			break;
		case 'p':
			DrawImage(sqX * SquareSize, sqY * SquareSize, PieceSize, PieceSize, PiecesImages[10]);
			break;
		case 'P':
			DrawImage(sqX * SquareSize, sqY * SquareSize, PieceSize, PieceSize, PiecesImages[11]);
			break;

	}
}



function drawChessBoard(){
	let squareIndex = 0;
	for (let posY = 0; posY < 8; posY++) {
		for (let posX = 0; posX < 8; posX++) {
			DrawSquare(
				posX * SquareSize, 
				posY * SquareSize,
				SquareSize,
				SquareSize,
				squareIndex % 2 == 0 ? ColorSquareWhite : ColorSquareBlack
			);
			/* Draw square indexes
			DrawText(
				(posX * SquareSize) + 2, 
				(posY * SquareSize) + SquareSize - 2,
				'large',
				'black',
				squareIndex
			);*/
			if(posY == 7){
				DrawText(
					(posX * SquareSize) + 84, 
					(posY * SquareSize) + SquareSize - 4,
					'25px',
					squareIndex % 2 == 0 ? ColorSquareBlack : ColorSquareWhite,
					String.fromCharCode(97 + posX)
				);
			}
			if(posX == 0){
				DrawText(
					(posX * SquareSize) + 2, 
					(posY * SquareSize) + 22,
					'25px',
					squareIndex % 2 == 0 ? ColorSquareBlack : ColorSquareWhite,
					posY + 1
				);
			}
			squareIndex++;
		}
		squareIndex++;

		DrawPiece(0,0,'k');
		DrawPiece(0,1,'K');
		DrawPiece(1,0,'q');
		DrawPiece(1,1,'Q');
		DrawPiece(2,0,'r');
		DrawPiece(2,1,'R');
		DrawPiece(3,0,'b');
		DrawPiece(3,1,'B');
		DrawPiece(4,0,'n');
		DrawPiece(4,1,'N');
		DrawPiece(5,0,'p');
		DrawPiece(5,1,'P');
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
        drawChessBoard();
    }
}

document.addEventListener('DOMContentLoaded', function() {
	fontRobotoFile.load().then(
		() => {
			
		},
		(err) => {
			console.error(err);
		},
		);
}, false);

