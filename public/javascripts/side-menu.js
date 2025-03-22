import { indexToPosition } from "./chess-utils.js";

let historyTable = document.getElementById("side-history-table");
let moveHistory = [];
let lastTableRow;
export function historyAppend(entry){
    moveHistory.push(entry);
    
    //white move
    if(moveHistory.length % 2 == 1) {
        lastTableRow = document.createElement("div");
        lastTableRow.classList.add("history-row", "roboto-regular");

        let rowIndex = document.createElement("div");
        rowIndex.classList.add("history-index");
        rowIndex.innerHTML = (moveHistory.length + 1) / 2;

        historyTable.appendChild(lastTableRow);
        lastTableRow.appendChild(rowIndex);

    }

    let newMove = document.createElement("div");
    newMove.classList.add("history-move");
    newMove.innerHTML = indexToPosition(entry.move.from) + " > " + indexToPosition(entry.move.to);
    lastTableRow.appendChild(newMove);
}