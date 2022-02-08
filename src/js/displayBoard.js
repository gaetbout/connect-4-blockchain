
const playerSymbol = '🔴'
const randomSymbol = '🟡'
const emptySymbol = '⚫' // ou bien ○

const boardDiv = document.querySelector('#boardDiv')

export function displayBoard(aJsonObject) {
    let playerCoords = aJsonObject.playerCoords
    let aiCoords = aJsonObject.aiCoordinates
    let boardStr = ''
    // Tu peux refaire cet algo pour d'ab build les cord puis display
    for (let row = 7; row > 0; row--) {
        for (let col = 1; col < 8; col++) {
            if (playerCoords.some((coords) => coords[0] == col && coords[1] == row)) {
                boardStr += playerSymbol;
            } else if (aiCoords.some((coords) => coords[0] == col && coords[1] == row)) {
                boardStr += randomSymbol;
            }
            else {
                boardStr += emptySymbol;
            }
        }
        boardStr += '<br/>';
    }
    boardDiv.innerHTML = boardStr;
}

export function emptyBoard() {
    boardDiv.innerHTML = '';
  }