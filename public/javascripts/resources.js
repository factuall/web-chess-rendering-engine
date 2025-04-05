

let ChessSounds = new Array(6);
for(let i = 0; i < 6; i++){
    ChessSounds[i] = new Audio();
}

let PieceImages = new Array(12);
for(let i = 0; i < 12; i++){
    PieceImages[i] = new Image();
}

//only soundset available: chesscom
//move/capture/castle/game-start/game-end/
export function loadSounds(soundSet){
	ChessSounds[0].src = `/sounds/${soundSet}/move.wav`;
	ChessSounds[1].src = `/sounds/${soundSet}/capture.wav`;
	ChessSounds[2].src = `/sounds/${soundSet}/castle.wav`;
	ChessSounds[3].src = `/sounds/${soundSet}/check.mp3`;
	ChessSounds[4].src = `/sounds/${soundSet}/game-start.wav`;
	ChessSounds[5].src = `/sounds/${soundSet}/game-end.wav`;
}

//https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces
//kK/qQ/rR/nN/bB/pP//
export function loadPieces(pieceSet, format){
	PieceImages[0].src = `/images/chess-icons/${pieceSet}/kdt.${format}`;
	PieceImages[1].src = `/images/chess-icons/${pieceSet}/klt.${format}`;
	PieceImages[2].src = `/images/chess-icons/${pieceSet}/qdt.${format}`;
	PieceImages[3].src = `/images/chess-icons/${pieceSet}/qlt.${format}`;
	PieceImages[4].src = `/images/chess-icons/${pieceSet}/rdt.${format}`;
	PieceImages[5].src = `/images/chess-icons/${pieceSet}/rlt.${format}`;
	PieceImages[6].src = `/images/chess-icons/${pieceSet}/ndt.${format}`;
	PieceImages[7].src = `/images/chess-icons/${pieceSet}/nlt.${format}`;
	PieceImages[8].src = `/images/chess-icons/${pieceSet}/bdt.${format}`;
	PieceImages[9].src = `/images/chess-icons/${pieceSet}/blt.${format}`;
	PieceImages[10].src = `/images/chess-icons/${pieceSet}/pdt.${format}`;
	PieceImages[11].src = `/images/chess-icons/${pieceSet}/plt.${format}`;
	return PieceImages;
}



export function getPieceImages(){
    return PieceImages;
}

export function getChessSounds(){
    return ChessSounds;
}

