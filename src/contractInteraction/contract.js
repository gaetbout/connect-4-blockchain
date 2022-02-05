import getConfig from '../config'

const nearConfig = getConfig(process.env.NODE_ENV || 'development')

const createGameButton = document.querySelector('#createGameButton')
const deleteGameButton = document.querySelector('#deleteGameButton')
createGameButton.onclick = createGame
deleteGameButton.onclick = deleteGame
const isInGameLabel = document.querySelector('#inGame')
const boardDiv = document.querySelector('#boardDiv')
const playButton = document.querySelectorAll('.playButton')
playButton.forEach(e => {
    e.onclick = playAtColumn
});
async function createGame() {
    this.disabled = true
    try {
        await window.contract.createGame({ accountId: window.accountId })
    } catch (e) {
        alert(
            e
        )
        throw e
    } finally {
        this.disabled = false
        fetchIsInGame()
    }
}

async function deleteGame() {
    this.disabled = true
    try {
        await window.contract.deleteGame({ accountId: window.accountId })
    } catch (e) {
        alert(
            e
        )
        throw e
    } finally {
        this.disabled = false
        fetchIsInGame()
    }
}

export async function fetchIsInGame() {
    createGameButton.disabled = true
    let isInGame = await contract.isInGame({ accountId: window.accountId })
    if (isInGame) {
        isInGameLabel.innerHTML = "You are in game"
        isInGameLabel.disabled = true
        createGameButton.disabled = true
        playButton.forEach(e => e.disabled = false)
        fetchBoard()
    } else {
        playButton.forEach(e => e.disabled = true)
        createGameButton.disabled = false
        isInGameLabel.innerHTML = "Press the button to start a new game"
    }
}

let playerSymbol = '🔴'
let randomSymbol = '🟡'
let emptySymbol = '⚫' // ou bien ○
async function fetchBoard() {
    console.log(`Fetching board for: ${window.accountId}`)
    let board = await window.contract.getGameCoordinates({ accountId: window.accountId })
    let boardParsed = JSON.parse(board)
    console.log(`Board: ${board}}`)
    let playerCoords= boardParsed.playerCoords
    console.log(playerCoords)
    let boardStr = ''
    for (let row = 7; row > 0; row--) {
        for (let col = 1; col < 8; col++) {
            if(playerCoords.some((coords) => coords[0] == col && coords[1] == row)){
                boardStr += playerSymbol;
            }else{
                boardStr += emptySymbol;
            }
        }
        boardStr += '<br/>';
    }
    boardDiv.innerHTML = boardStr;
}

async function playAtColumn() {
    let column = this.getAttribute('column')
    playButton.forEach(e => e.disabled = true)
    try {
        await window.contract.playAtColumn({ columnString: column, accountId: window.accountId })
    } catch (e) {
        throw e
    } finally {
        playButton.forEach(e => e.disabled = true)
        this.disabled = false
        fetchIsInGame()
    }
    console.log(this.getAttribute('column'))
}