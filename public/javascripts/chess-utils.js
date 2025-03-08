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

export function IndexToPosition(index){
	let x = index - (Math.floor(index / 8) * 8);
	let y = Math.floor(index / 8);
	return {x, y};
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

//credit for idea/function: Sebastian Lague
var SqDirectionOffsets = [-8, 8, -1, 1, -9, -7, 7, 9]; // north, south, west, east, nw, ne, sw, se
var SqEdgeDistances = [];
function PrecomputeEdgeDistances(){
	SqEdgeDistances = [];
	for (let posY = 0; posY < 8; posY++) {
		for (let posX = 0; posX < 8; posX++) {
			let numNorth = posY;
			let numSouth = 7 - posY;
			let numWest = posX;
			let numEast = 7 - posX;
			let numNW = Math.min(numNorth, numWest);
			let numSW = Math.min(numSouth, numWest);
			let numNE = Math.min(numNorth, numEast);
			let numSE = Math.min(numSouth, numEast);

			SqEdgeDistances.push([
				numNorth,
				numSouth,
				numWest,
				numEast,
				numNW,
				numNE,
				numSW,
				numSE
			]);
		}
	}
}
PrecomputeEdgeDistances();


export function GetPossiblePieceMoves(position, pieceIndex, piece){
	let pieceMoves = [];
	let isWhite = (piece.toUpperCase() == piece); 
	if(piece == 'x') return pieceMoves;
	switch(piece){
		case 'x':
			return pieceMoves;
		case 'q':
		case 'Q':
			for (let dir = 0; dir < 8; dir++) {
				// north, south, west, east, nw, sw, ne, se
				let destinationIndex = pieceIndex;

				for (let dist = 0; dist < SqEdgeDistances[pieceIndex][dir]; dist++) {
					destinationIndex += SqDirectionOffsets[dir];
					console.log(position.length);
					if(destinationIndex >= 63) break;
					let isDestWhite = position[destinationIndex].toUpperCase() == position[destinationIndex];
					if(isWhite == isDestWhite && position[destinationIndex] != 'x') break;
					pieceMoves.push({from: pieceIndex, to: destinationIndex});
				}
			}
			return pieceMoves;
			break;
		case 'k':
		case 'K':
			for (let dir = 0; dir < 8; dir++) {
				// north, south, west, east, nw, sw, ne, se
				let destinationIndex = pieceIndex;
				if(SqEdgeDistances[pieceIndex][dir] == 0) continue;
					destinationIndex += SqDirectionOffsets[dir];
					let isDestWhite = position[destinationIndex].toUpperCase() == position[destinationIndex];
					if(isWhite == isDestWhite && position[destinationIndex] != 'x') break;
					pieceMoves.push({from: pieceIndex, to: destinationIndex});
				
			}
			return pieceMoves;
			break;
		case 'r':
		case "R":
			for (let dir = 0; dir < 4; dir++) {
				//north, south, west, east
				let destinationIndex = pieceIndex;
				for (let dist = 0; dist < SqEdgeDistances[pieceIndex][dir]; dist++) {
					destinationIndex += SqDirectionOffsets[dir];
					let isDestWhite = position[destinationIndex].toUpperCase() == position[destinationIndex];
					if(isWhite == isDestWhite && position[destinationIndex] != 'x') break;
					pieceMoves.push({from: pieceIndex, to: destinationIndex});
				}
			}
			return pieceMoves;
			break;
		case 'b':
		case "B":
			for (let dir = 4; dir < 8; dir++) {
				//nw, sw, ne, se
				let destinationIndex = pieceIndex;
				for (let dist = 0; dist < SqEdgeDistances[pieceIndex][dir]; dist++) {
					destinationIndex += SqDirectionOffsets[dir];
					let isDestWhite = position[destinationIndex].toUpperCase() == position[destinationIndex];
					if(isWhite == isDestWhite && position[destinationIndex] != 'x') break;
					pieceMoves.push({from: pieceIndex, to: destinationIndex});
				}
			}
			return pieceMoves;
			break;
		default:
			return pieceMoves;
	}
}

//okay, I know, this is a hack - I do it because I don't want to move to TypeScript nor use Classes right now and still have something "struct-like" 
function chessPiece(indexOnBoard, type, possibleMoves){
	return {index: indexOnBoard, type: type, moves: possibleMoves};
}

function move(indexFrom, indexTo){
	return {from: indexFrom, to: indexTo};
}

console.log(SqEdgeDistances);