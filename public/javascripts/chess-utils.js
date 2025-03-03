export function InterpretFen(fen){
	let positions = [];
	let ntFragments = fen.split(" ");
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

export function SquareIndexToPosition(index){
	let position = "";
	
	let column =  //Math.ceil(index /  )// index-((Math.floor((index)/8)*8));
	position += column;//
	return position;
}

export function PositionToFen(position){
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