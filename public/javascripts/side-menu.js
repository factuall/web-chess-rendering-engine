import { indexToPosition } from "./chess-utils.js";

let historyTable = document.getElementById("side-history-table");
let moveHistory = [];
let historyElements = [];
let lastElementHighlighted = -1;
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
    historyElements.push(newMove);
    console.log(historyElements);

    let moveIndex = moveHistory.length-1;
    newMove.addEventListener("click", ()=>{
        jumpInHistory(moveIndex);
    });
}

function jumpInHistory(historyIndex){
    let eventHistoryJump = new CustomEvent("history-jump", {detail: historyIndex});
    document.dispatchEvent(eventHistoryJump);
}

document.addEventListener("history-jumped", (e) =>{//this is called once the board confirms the successful history jump
    if(lastElementHighlighted != -1){
        historyElements[lastElementHighlighted].classList.remove('history-move-highlighted');
    }
    if(e.detail != -1){
        historyElements[e.detail].classList.add('history-move-highlighted');
    }
    lastElementHighlighted = e.detail;
});