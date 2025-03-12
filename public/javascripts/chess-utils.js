import { GameState, getGameState } from "./globals.js"

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

export function PositionToFen(position, GameState){
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
	let lGameState = getGameState(); 
	let colorMoving = lGameState.whiteMoves ? 'w' : 'b';
	fen += ` ${colorMoving} `;
	if(	!lGameState.canWhiteCastleK && !lGameState.canWhiteCastleQ && !lGameState.canBlackCastleK && !lGameState.canBlackCastleQ){
		fen += '- ';
	}else{
		if(lGameState.canWhiteCastleK) fen += 'K';
		if(lGameState.canWhiteCastleQ) fen += 'Q';
		if(lGameState.canBlackCastleK) fen += 'k';
		if(lGameState.canBlackCastleQ) fen += 'q';
		fen += ' ';
	}
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

export function GetLegalMoves(gameState){
	gameState = getGameState();
	let position = getGameState().position;
	let whiteKingPos = -1, blackKingPos = -1; //start with negative number as we did not find anything yer
	for (let p = 0; p < 64; p++) {
		if(position[p] == 'K')
			whiteKingPos = p;
		if(position[p] == 'k')
			blackKingPos = p;
		if(whiteKingPos > -1 && blackKingPos > -1) //both kings found
			break;
	}

	let allPieceMoves = GetAllPseudoLegalMoves(gameState);
	let allLegalMoves = allPieceMoves.slice();
	console.log(allLegalMoves);
	let allNewPositions = getAllPossiblePositions(gameState.position, allPieceMoves);
	let imaginaryGameState;
	let movesRemoved = 0;
	for (let pos = 0; pos < allNewPositions.length; pos++) {
		//TODO: take account of the fact that the castle abilities might change in some of these positions
		
		imaginaryGameState = structuredClone(gameState);
		imaginaryGameState.whiteMoves = !gameState.whiteMoves;
		imaginaryGameState.position = allNewPositions[pos];
		//console.log(allNewPositions[pos]);
		let imaginaryMoves = GetAllPseudoLegalMoves(imaginaryGameState);
		for (let iM = 0; iM < imaginaryMoves.length; iM++) {
			if(!imaginaryMoves[iM].isCapture) continue;
			if((imaginaryMoves[iM].to == whiteKingPos && !imaginaryGameState.whiteMoves) ||
			(imaginaryMoves[iM].to == blackKingPos && imaginaryGameState.whiteMoves)){
				//console.log(allPieceMoves[pos], imaginaryMoves[iM]);
				//console.log(allLegalMoves, pos);
				//allLegalMoves.splice(pos-movesRemoved, 1);
				movesRemoved += 1;
				break;
			}
		}
	}
	return allLegalMoves;
}

function GetAllPseudoLegalMoves(gameState){
	let position = gameState.position;
	let allPieceMoves = [];
	for (let i = 0; i < 64; i++) {
		if(position[i] == 'x') continue;
		if(!isPieceWhite(position[i]) && gameState.whiteMoves) continue;
		let pieceMoves = GetPossiblePieceMoves(position, i, position[i], gameState);
		allPieceMoves = allPieceMoves.concat(pieceMoves);
	}
	return allPieceMoves;
}

export function GetPossiblePieceMoves(position, pieceIndex, piece, gameState){
	let pieceMoves = [];
	let isWhite = (piece.toUpperCase() == piece); 
	if(gameState.whiteMoves && !isWhite) return pieceMoves;
	
	if(!gameState.whiteMoves && isWhite) return pieceMoves;
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
					if(isCapture) break;
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
					if(isCapture) break;
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
					if(isCapture) break;
				}
			}
			return pieceMoves;
			break;
		case 'p':
		case "P": //TODO: prevent from capturing a piece on the other side of the board caused by the board-table wrapping
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
						isDestWhite = position[destinationIndex+1].toUpperCase() == position[destinationIndex+1];
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
				let isDestWhite = isPieceWhite(position[destinationIndex]);
				let isCapture = position[destinationIndex] != 'x';
				if(isWhite == isDestWhite && isCapture) continue;
				pieceMoves.push({from: pieceIndex, to: destinationIndex, isCapture: isCapture});
			}
			return pieceMoves;
			break;
		default:
			return pieceMoves;
	}
}

/*
export function GetPossiblePieceMoves(position, pieceIndex, piece){
	let pieceMoves = [];
	let isWhite = (piece.toUpperCase() == piece); 
	if(GameState.whiteMoves && !isWhite) return pieceMoves;
	
	if(!GameState.whiteMoves && isWhite) return pieceMoves;
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
		case "P": //TODO: prevent from capturing a piece on the other side of the board caused by the board-table wrapping
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
						isDestWhite = position[destinationIndex+1].toUpperCase() == position[destinationIndex+1];
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

*/

//okay, I know, this is a hack - I do it because I don't want to move to TypeScript nor use Classes right now and still have something "struct-like" 
function chessPiece(indexOnBoard, type, possibleMoves){
	return {index: indexOnBoard, type: type, moves: possibleMoves};
}

function move(indexFrom, indexTo){
	return {from: indexFrom, to: indexTo};
}

export function isPieceWhite(piece){
	return piece.toUpperCase() == piece;
}

console.log(SqEdgeDistances);

function getAllPossiblePositions(position, moves){
	let possiblePositions = [];
	for (let i = 0; i < moves.length; i++) {
		let newPosition = position.slice();
		newPosition[moves[i].to] = newPosition[moves[i].from];
		newPosition[moves[i].from] = 'x';
		possiblePositions.push(newPosition);
	}
	return possiblePositions;
}