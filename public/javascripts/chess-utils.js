import { GameState, getGameState } from "./globals.js"

export function interpretFen(fen){
	let pieces = [];
	let ntFragments = fen.split(" ");
	let rows = ntFragments[0].split("/");

	for (let row = 0; row < rows.length; row++) {
		let tokens = rows[row].split("");
		for (let token = 0; token < tokens.length; token++) {

			let tokenNum = parseInt(tokens[token]);
			if(!isNaN(tokenNum) && tokens[token] === '' + tokenNum){ //number token
				for (let i = 0; i < tokens[token]; i++) {
					pieces.push('x');	
				}
			}else{ //letter token
					pieces.push(tokens[token]);
			}
		}
	}

	let gameState = {
		position: pieces,
		legalMoves: [],
		whiteMoves: ntFragments[1] === 'w' ? true : false,
		canWhiteCastleQ: false,
		canBlackCastleQ: false,
		canWhiteCastleK: false,
		canBlackCastleK: false,
		enPassant: -1
	};

	let castleRights = ntFragments[2].split("");
	for (let i = 0; i < castleRights.length; i++) {
		if(castleRights[i] === 'K') gameState.canWhiteCastleK = true; 
		if(castleRights[i] === 'Q') gameState.canWhiteCastleQ = true;
		if(castleRights[i] === 'k') gameState.canBlackCastleK = true; 
		if(castleRights[i] === 'q') gameState.canBlackCastleQ = true;
	}

	let enPassantFragments = ntFragments[3].split("");
	if(enPassantFragments[0] !== '-'){
		let enPassantIndex = (enPassantFragments[0].charCodeAt(0) - 'a'.charCodeAt('a')) * 8
		enPassantIndex += parseInt(enPassantFragments[1]);
		gameState.enPassant = enPassantIndex;
	}
	return gameState;
}

export function indexToCoords(index){
	let x = index - (Math.floor(index / 8) * 8);
	let y = Math.floor(index / 8);
	return {x, y};
}

export function indexToPosition(index){
	let coords = indexToCoords(index);
	return String.fromCharCode('a'.charCodeAt(0) + coords.x) + (8 - coords.y);
}

export function positionToFen(position, GameState){
	let fen = "";
	for (let posY = 0; posY < 8; posY++) {
		
		let emptyCounter = 0;
		for (let posX = 0; posX < 8; posX++) {
			let offset = posX + (posY * 8);
			if(position[offset] === 'x'){
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
	//TODO: actually grab the GameState from the argument instead of getting it right here and update all of the functions in the rest of the code
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
	if(lGameState.enPassant > -1){
		let coords = indexToCoords(lGameState.enPassant);
		fen += String.fromCharCode(97 + coords.x) + (8 - coords.y) + ' ';
	}else{
		fen += '-';
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
function precomputeEdgeDistances(){
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
precomputeEdgeDistances();

export function getLegalMoves(gameState){
	gameState = getGameState();
	let position = getGameState().position;
	let whiteKingPos = -1, blackKingPos = -1; //start with negative number as we did not find anything yer
	for (let p = 0; p < 64; p++) {
		if(position[p] === 'K')
			whiteKingPos = p;
		if(position[p] === 'k')
			blackKingPos = p;
		if(whiteKingPos > -1 && blackKingPos > -1) //both kings found
			break;
	}

	let allPieceMoves = getAllPseudoLegalMoves(gameState);
	let allLegalMoves = allPieceMoves.slice();
	let allNewPositions = getAllPossiblePositions(gameState.position, allPieceMoves);
	let imaginaryGameState;
	let movesRemoved = 0;
	for (let pos = 0; pos < allNewPositions.length; pos++) {
		//TODO: take account of the fact that the castle abilities might change in some of these positions
		imaginaryGameState = structuredClone(gameState);
		imaginaryGameState.whiteMoves = !gameState.whiteMoves;
		imaginaryGameState.position = allNewPositions[pos];
		//console.log(allNewPositions[pos]);
		let imaginaryMoves = getAllPseudoLegalMoves(imaginaryGameState);
		for (let iM = 0; iM < imaginaryMoves.length; iM++) {
			if(!imaginaryMoves[iM].isCapture) continue;
			if((imaginaryMoves[iM].to === whiteKingPos && !imaginaryGameState.whiteMoves) ||
			(imaginaryMoves[iM].to === blackKingPos && imaginaryGameState.whiteMoves)){
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

function getAllPseudoLegalMoves(gameState){
	let position = gameState.position;
	let allPieceMoves = [];
	for (let i = 0; i < 64; i++) {
		if(position[i] === 'x') continue;
		if(!isPieceWhite(position[i]) && gameState.whiteMoves) continue;
		let pieceMoves = getPossiblePieceMoves(position, i, position[i], gameState);
		allPieceMoves = allPieceMoves.concat(pieceMoves);
	}
	return allPieceMoves;
}

export function getPossiblePieceMoves(position, pieceIndex, piece, gameState){
	let pieceMoves = [];
	let isWhite = (piece.toUpperCase() === piece); 
	if(gameState.whiteMoves && !isWhite) return pieceMoves;
	
	if(!gameState.whiteMoves && isWhite) return pieceMoves;
	if(piece === 'x') return pieceMoves;
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
					let isDestWhite = position[destinationIndex].toUpperCase() === position[destinationIndex];
					let isCapture = position[destinationIndex] != 'x';
					if(isWhite === isDestWhite && isCapture) break;
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
				if(SqEdgeDistances[pieceIndex][dir] === 0) continue;
				destinationIndex += SqDirectionOffsets[dir];
				let isDestWhite = position[destinationIndex].toUpperCase() === position[destinationIndex];
				let isCapture = position[destinationIndex] != 'x';
				if(isWhite === isDestWhite && isCapture) break;
				pieceMoves.push({from: pieceIndex, to: destinationIndex, isCapture: isCapture});
			}
			if( gameState.canWhiteCastleK && isWhite && //castling as white king side
				!isSquareAttacked(position, pieceIndex, false) && 
				gameState.position[61] === 'x' && !isSquareAttacked(position, 61, false) &&
				gameState.position[62] === 'x' && !isSquareAttacked(position, 62, false)
			)
				pieceMoves.push({from: pieceIndex, to: 62, isCapture: false, isCastleK: true})
			
			if( gameState.canWhiteCastleQ && isWhite && //castling as white queen side
				!isSquareAttacked(position, pieceIndex, false) &&  
				gameState.position[57] === 'x' && !isSquareAttacked(position, 57, false) &&
				gameState.position[58] === 'x' && !isSquareAttacked(position, 58, false) &&
				gameState.position[59] === 'x' && !isSquareAttacked(position, 59, false) 
			)
				pieceMoves.push({from: pieceIndex, to: 58, isCapture: false, isCastleQ: true})
		
			if( gameState.canBlackCastleK && !isWhite && //castling as white king side
				!isSquareAttacked(position, pieceIndex, false) && 
				gameState.position[6] === 'x' && !isSquareAttacked(position, 6, true) &&
				gameState.position[5] === 'x' && !isSquareAttacked(position, 5, true)
			)
				pieceMoves.push({from: pieceIndex, to: 6, isCapture: false, isCastleK: true})
			
			if( gameState.canBlackCastleQ && !isWhite && //castling as white queen side
				!isSquareAttacked(position, pieceIndex, false) &&  
				gameState.position[3] === 'x' && !isSquareAttacked(position, 3, true) &&
				gameState.position[2] === 'x' && !isSquareAttacked(position, 2, true) &&
				gameState.position[1] === 'x' && !isSquareAttacked(position, 1, true) 
			)
				pieceMoves.push({from: pieceIndex, to: 2, isCapture: false, isCastleQ: true})


			
			return pieceMoves;
			break;
		case 'r':
		case "R":
			for (let dir = 0; dir < 4; dir++) {
				//north, south, west, east
				let destinationIndex = pieceIndex;
				for (let dist = 0; dist < SqEdgeDistances[pieceIndex][dir]; dist++) {
					destinationIndex += SqDirectionOffsets[dir];
					let isDestWhite = position[destinationIndex].toUpperCase() === position[destinationIndex];
					let isCapture = position[destinationIndex] != 'x';
					if(isWhite === isDestWhite && isCapture) break;
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
					let isDestWhite = position[destinationIndex].toUpperCase() === position[destinationIndex];
					let isCapture = position[destinationIndex] != 'x';
					if(isWhite === isDestWhite && isCapture) break;
					pieceMoves.push({from: pieceIndex, to: destinationIndex, isCapture: isCapture});
					if(isCapture) break;
				}
			}
			return pieceMoves;
			break;
		case 'p':
		case "P": //TODO: prevent from capturing a piece on the other side of the board caused by the board-table wrapping
			let range = 1;
			if ((isWhite && indexToCoords(pieceIndex).y === 6) || 
				(!isWhite && indexToCoords(pieceIndex).y === 1))
			range = 2;
			let dir = isWhite ? 0 : 1;
			let destinationIndex = pieceIndex;
			for (let dist = 0; dist < SqEdgeDistances[pieceIndex][dir]; dist++) {
				let isDestWhite;
				destinationIndex += SqDirectionOffsets[dir];
				if(dist === 0){//capturing moves
					if(position[destinationIndex-1] != 'x'){
						isDestWhite = position[destinationIndex-1].toUpperCase() === position[destinationIndex-1];
						if(isWhite != isDestWhite)
							pieceMoves.push({from: pieceIndex, to: destinationIndex-1, isCapture: true});
					}
					if(position[destinationIndex+1] != 'x'){
						isDestWhite = position[destinationIndex+1].toUpperCase() === position[destinationIndex+1];
						if(isWhite != isDestWhite)
							pieceMoves.push({from: pieceIndex, to: destinationIndex+1, isCapture: true});
					}
					if(gameState.enPassant > -1){
						let enPassantOffset = isWhite ? -8 : 8;
						if(gameState.enPassant === pieceIndex+1){
							pieceMoves.push({from: pieceIndex, to: gameState.enPassant+enPassantOffset, isCapture: true, enPassant: true});
						}
						if(gameState.enPassant === pieceIndex-1){
							pieceMoves.push({from: pieceIndex, to: gameState.enPassant+enPassantOffset, isCapture: true, enPassant: true});
						}
					}
				}
				if(dist >= range) break;
				isDestWhite = position[destinationIndex].toUpperCase() === position[destinationIndex];
				if(position[destinationIndex] != 'x') break;
				if(dist === 1)
					pieceMoves.push({from: pieceIndex, to: destinationIndex, isCapture: false, doublePawnMove: true});
				else
					pieceMoves.push({from: pieceIndex, to: destinationIndex, isCapture: false, doublePawnMove: false});
				
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
				if(isWhite === isDestWhite && isCapture) continue;
				pieceMoves.push({from: pieceIndex, to: destinationIndex, isCapture: isCapture});
			}
			return pieceMoves;
			break;
		default:
			return pieceMoves;
	}
}

export function performMove(gameState, move){
	//losing castle rights after moving a king
		if(gameState.position[move.from] === 'K'){
			gameState.canWhiteCastleK = false;
			gameState.canWhiteCastleQ = false;

		}
		if(gameState.position[move.from] === 'k'){
			gameState.canBlackCastleK = false;
			gameState.canBlackCastleQ = false;
		}

		//rook moved
		if(move.from === 56) gameState.canWhiteCastleK = false;//a1
		if(move.from === 63) gameState.canWhiteCastleQ = false;//h1
		if(move.from === 0) gameState.canBlackCastleK = false;//a8
		if(move.from === 7) gameState.canBlackCastleQ = false;//h8

		//pawn double square move
		if(move.doublePawnMove === true){
			gameState.enPassant = move.to;
		}else{
			gameState.enPassant = -1;
		}

		if(isPieceWhite(gameState.position[move.from])){
			if(move.isCastleK){
				gameState.position[63] = 'x';
				gameState.position[61] = 'R';
			}

			if(move.isCastleQ){
				gameState.position[56] = 'x';
				gameState.position[59] = 'R';
			}
		}else{
			if(move.isCastleK){
				gameState.position[7] = 'x';
				gameState.position[5] = 'r';
			}

			if(move.isCastleQ){
				gameState.position[0] = 'x';
				gameState.position[3] = 'r';
			}
		}

		//en passant
		if(move.enPassant === true){
			if(isPieceWhite(gameState.position[pieceHeldIndex])){
				gameState.position[move.to + 8] = 'x';
			}else{
				gameState.position[move.to - 8] = 'x';
			}
		}

		gameState.position[move.to] = gameState.position[move.from];
		gameState.position[move.from] = 'x';
		gameState.legalMoves = getLegalMoves(gameState);
}

export function isPieceWhite(piece){
	return piece.toUpperCase() === piece;
}

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

function isSquareAttacked(position, checkedSquare, isAttackerWhite){
	let attacked = false;
	let imaginaryGameState = {position: position, whiteMoves: isAttackerWhite};
	let imaginaryMoves = getAllPseudoLegalMoves(imaginaryGameState);
	for (let iM = 0; iM < imaginaryMoves.length; iM++) {
		if(imaginaryMoves[iM].to === checkedSquare){
			attacked = true;
			break;
		}
	}
	return attacked;
}