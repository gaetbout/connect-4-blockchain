
const playerSymbol = '🔴'
const randomSymbol = '🟡'
const emptySymbol = '⚫' // ou bien ○

const boardDiv = document.querySelector('#boardDiv')
const playButton = document.querySelectorAll('.playButton')

export function displayBoard(aJsonObject) {
    let boardStr = ''
    
    let playerCoords = aJsonObject.coordinates.playerCoords
    let aiCoords = aJsonObject.coordinates.aiCoords
    _disableWrongButtons(aJsonObject.possibleMoves)
    for (let row = 6; row >= 0; row--) {
        for (let col = 0; col < 7; col++) {
            boardStr += _getCorrectSymbol(row, col, playerCoords, aiCoords)
        }
        boardStr += '<br/>';
    }
    if(aJsonObject.gameState == "BOARD_FULL"){
        boardStr = 'Board full <br/> No more token will be accepted <br/>' + boardStr;
        _disableWrongButtons([])
    }
    boardDiv.innerHTML = boardStr;
}

export function emptyBoard() {
    boardDiv.innerHTML = '';
}

function _disableWrongButtons(allButtonThatShouldBeEnabled){
    playButton.forEach(element => {
        let col = parseInt(element.getAttribute('column'))
        if (allButtonThatShouldBeEnabled.includes(col)){
            element.disabled= false;
        }else{
            element.disabled= true;
        }
    });
}
function _getCorrectSymbol(row, col, playerCoords, aiCoords) {
    if (playerCoords.some((coords) => coords[0] == col && coords[1] == row)) {
        return playerSymbol;
    }
    if (aiCoords.some((coords) => coords[0] == col && coords[1] == row)) {
        return randomSymbol;
    }

    return emptySymbol;
}