
const playerSymbol = '🔴'
const randomSymbol = '🟡'
const emptySymbol = '⚫' // ou bien ○

const boardDiv = document.querySelector('#boardDiv')

export function displayBoard(aJsonObject) {
    let playerCoords = aJsonObject.playerCoords
    let aiCoords = aJsonObject.aiCoords
    let boardStr = ''
    for (let row = 7; row > 0; row--) {
        for (let col = 1; col < 8; col++) {
            boardStr += getCorrectSymbol(row, col, playerCoords, aiCoords)
        }
        boardStr += '<br/>';
    }
    boardDiv.innerHTML = boardStr;
}

export function emptyBoard() {
    boardDiv.innerHTML = '';
}

function getCorrectSymbol(row, col, playerCoords, aiCoords) {
    if (playerCoords.some((coords) => coords[0] == col && coords[1] == row)) {
        return playerSymbol;
    }
    if (aiCoords.some((coords) => coords[0] == col && coords[1] == row)) {
        return randomSymbol;
    }

    return emptySymbol;
}