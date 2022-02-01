import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import getConfig from '../config'

export const nearConfig = getConfig(process.env.NODE_ENV || 'development')

export async function initContract() {
    const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))
    window.walletConnection = new WalletConnection(near)
    window.accountId = window.walletConnection.getAccountId()
    window.contract = await new Contract(window.walletConnection.account(), nearConfig.contractName, {
        viewMethods: ['isInGame', 'getGameCoordinates'],
        changeMethods: ['createGame', 'playAtColumn'],
    })
}
