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
var SqKnightDirOffsets = [
	-17, -15,
	15, 17,
	-10, 6,
	-6, 10]; //north, south, west, east
var SqKnightMinDistances = [ 
	{up: 2, left: 1},
	{up: 2, right: 1},
	{down: 2, left: 1},
	{down: 2, right: 1},
	{left: 2, up: 1},
	{left: 2, down: 1},
	{right: 2, up: 1},
	{right: 2, down: 1},
];
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
					if(destinationIndex >= 63) break;
					let isDestWhite = position[destinationIndex].toUpperCase() == position[destinationIndex];
					let isCapture = position[destinationIndex] != 'x';
					if(isWhite == isDestWhite && isCapture) break;
					pieceMoves.push({from: pieceIndex, to: destinationIndex, isCapture: isCapture});
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
				let isCapture = position[destinationIndex] != 'x';
				if(isWhite == isDestWhite && isCapture) break;
				pieceMoves.push({from: pieceIndex, to: destinationIndex, isCapture: isCapture});
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
					let isCapture = position[destinationIndex] != 'x';
					if(isWhite == isDestWhite && isCapture) break;
					pieceMoves.push({from: pieceIndex, to: destinationIndex, isCapture: isCapture});
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
					let isCapture = position[destinationIndex] != 'x';
					if(isWhite == isDestWhite && isCapture) break;
					pieceMoves.push({from: pieceIndex, to: destinationIndex, isCapture: isCapture});
				}
			}
			return pieceMoves;
			break;
		case 'p':
		case "P":
			let range = 1;
			if ((isWhite && IndexToPosition(pieceIndex).y == 6) || 
				(!isWhite && IndexToPosition(pieceIndex).y == 1))
			range = 2;
			let dir = isWhite ? 0 : 1;
			let destinationIndex = pieceIndex;
			for (let dist = 0; dist < SqEdgeDistances[pieceIndex][dir]; dist++) {
				let isDestWhite;
				destinationIndex += SqDirectionOffsets[dir];
				if(dist == 0){//capturing moves
					if(position[destinationIndex-1] != 'x'){
						isDestWhite = position[destinationIndex-1].toUpperCase() == position[destinationIndex-1];
						if(isWhite != isDestWhite)
							pieceMoves.push({from: pieceIndex, to: destinationIndex-1, isCapture: true});
					}
					if(position[destinationIndex+1] != 'x'){
						isDestWhite = position[destinationIndex-1].toUpperCase() == position[destinationIndex+1];
						if(isWhite != isDestWhite)
							pieceMoves.push({from: pieceIndex, to: destinationIndex+1, isCapture: true});
					}
				}
				if(dist >= range) break;
				isDestWhite = position[destinationIndex].toUpperCase() == position[destinationIndex];
				if(position[destinationIndex] != 'x') break;
				pieceMoves.push({from: pieceIndex, to: destinationIndex, isCapture: false});
			}
			return pieceMoves;
			break;
		case 'n':
		case 'N':
			for (let dir = 0; dir < 8; dir++) {
				//absolute junk, but does for now
				if(
					(SqKnightMinDistances[dir].up != null && SqEdgeDistances[pieceIndex][0] < SqKnightMinDistances[dir].up) ||
					(SqKnightMinDistances[dir].down != null && SqEdgeDistances[pieceIndex][1] < SqKnightMinDistances[dir].down) ||
					(SqKnightMinDistances[dir].left != null && SqEdgeDistances[pieceIndex][2] < SqKnightMinDistances[dir].left) ||
					(SqKnightMinDistances[dir].right != null && SqEdgeDistances[pieceIndex][3] < SqKnightMinDistances[dir].right))
						continue;
				let destinationIndex = pieceIndex;
				destinationIndex += SqKnightDirOffsets[dir];
				let isDestWhite = position[destinationIndex].toUpperCase() == position[destinationIndex];
				let isCapture = position[destinationIndex] != 'x';
				if(isWhite == isDestWhite && isCapture) break;
				pieceMoves.push({from: pieceIndex, to: destinationIndex, isCapture: isCapture});
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