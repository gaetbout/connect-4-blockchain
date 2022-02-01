import getConfig from '../config'

const nearConfig = getConfig(process.env.NODE_ENV || 'development')

const createGameButton = document.querySelector('#createGameButton')
createGameButton.onclick = createGame
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

export async function fetchIsInGame() {
    createGameButton.disabled = false;
    let isInGame = await contract.isInGame({ player: window.accountId })
    if (isInGame) {
        isInGameLabel.innerHTML = "You are in game"
        isInGameLabel.disabled = true
        createGameButton.disabled = true
        fetchBoard()
    } else {
        createGameButton.disabled = false
        isInGameLabel.innerHTML = "Press the button to start a new game"
    }
}

let playerSymbol = '🔴'
let randomSymbol = '🟡'
let emptySymbol = '⚫' // ou bien ○
async function fetchBoard() {
    console.log('Fetching board')
    let board = await contract.getGameCoordinates({ player: window.accountId })
    console.log(`Board: ${board}}`)

    /*displayBoard(): string {
        // TODO faut pas return le board mais un array de coordonées et le render coté client
        let board = ''
        for (let row = 0; row < 7; row++) {
            for (let col = 0; col < 7; col++) {
                board += this.emptySymbol;
            }
            board += '<br/>';
        }
        return board
    }*/
    /*
    let board = await contract.getBoard({ player: window.accountId })
    boardDiv.innerHTML = board*/
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