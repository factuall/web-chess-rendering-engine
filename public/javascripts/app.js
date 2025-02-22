// App js


const canvas = document.getElementById("board-canvas");
const ctx = canvas.getContext("2d");

function DrawSquare(x, y, w, h, color){
	ctx.fillStyle = color;
	ctx.fillRect(x, y, w, h);
}

function DrawText(x, y, size, color, text) {
	ctx.font = `${size} serif`;
	ctx.fillStyle = color;
	ctx.fillText(text, x, y);
  }

function SquareIndexToPosition(index){
	let position = "";
	
	let column =  //Math.ceil(index /  )// index-((Math.floor((index)/8)*8));
	position += column;//
	return position;
}

var ColorSquareWhite = '#f0d9b5';
var ColorSquareBlack = '#b58863';

var SquareSize = 100;
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
					(posX * SquareSize) + 86, 
					(posY * SquareSize) + SquareSize - 2,
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
	}
}

drawChessBoard();