import 'regenerator-runtime/runtime'

import { login, logout } from './js/login' 
import { emptyBoard } from './js/displayBoard' 
import { isInGame, createGameContract, deleteGameContract, playAtColumnContract, fetchBoardAndDisplayBoard } from './js/contract'

document.querySelector('#sign-in-button').onclick = login
document.querySelector('#sign-out-button').onclick = logout
const createGameButton = document.querySelector('#createGameButton')
const deleteGameButton = document.querySelector('#deleteGameButton')
createGameButton.onclick = createGame
deleteGameButton.onclick = deleteGame
const isInGameLabel = document.querySelector('#inGame')
const playButton = document.querySelectorAll('.playButton')

playButton.forEach(e => {
    e.onclick = playAtColumn
});

export function mainFlow() {
  fetchIsInGame()
}


async function fetchIsInGame() {
  createGameButton.disabled = true
  deleteGameButton.disabled = true
  if (await isInGame()) {
    _handleInGame()
  } else {
    _handleNotInGame()
  }
}

async function createGame() {
  createGameButton.disabled = true
  await createGameContract()
  await fetchIsInGame()
  createGameButton.disabled = false
}

async function deleteGame() {
  deleteGameButton.disabled = true
  await deleteGameContract()
  await fetchIsInGame()
  deleteGameButton.disabled = false
}

async function playAtColumn(){
  let column = this.getAttribute('column')
  setDisabledForAllColumnButtonTo(true)
  await playAtColumnContract(column)
  fetchIsInGame()
}

function setDisabledGameButtonTo(aBoolean) {
  createGameButton.disabled = aBoolean
  deleteGameButton.disabled = !aBoolean
}

function _handleInGame(){
  isInGameLabel.innerHTML = "You are in game"
  setDisabledGameButtonTo(true)
  setDisabledForAllColumnButtonTo(false)
  fetchBoardAndDisplayBoard()
}

function _handleNotInGame(){
  emptyBoard()
  setDisabledGameButtonTo(false)
  setDisabledForAllColumnButtonTo(true)
  isInGameLabel.innerHTML = "Press the button to start a new game"

}

function setDisabledForAllColumnButtonTo(aBoolean) {
  playButton.forEach(e => e.disabled = aBoolean)

}