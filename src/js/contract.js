import getConfig from '../config'
import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import { displayBoard } from './displayBoard'

export const nearConfig = getConfig(process.env.NODE_ENV || 'development')

export async function initContract() {
    const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))
    window.walletConnection = new WalletConnection(near)
    window.accountId = window.walletConnection.getAccountId()
    window.contract = await new Contract(window.walletConnection.account(), nearConfig.contractName, {
        viewMethods: ['isInGame', 'getGameCoordinates'],
        changeMethods: ['createGame', 'playAtColumn', 'deleteGame'],
    })
}

export async function createGameContract() {
    await window.contract.createGame({ accountId: window.accountId })

}

export async function deleteGameContract() {
    await window.contract.deleteGame({ accountId: window.accountId })
}

export async function isInGame() {
    let result = await window.contract.isInGame({ accountId: window.accountId })
    return result
}

export async function fetchBoardAndDisplayBoard() {
    let board = await window.contract.getGameCoordinates({ accountId: window.accountId })
    displayBoard(JSON.parse(board))
}

export async function playAtColumnContract(column) {
    await window.contract.playAtColumn({ columnString: column, accountId: window.accountId })

}