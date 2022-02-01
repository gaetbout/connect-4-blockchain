import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import { initContract } from './utils'

import getConfig from '../config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

let mainFlow = require('../index').mainFlow
let nearConfig = require('./utils').nearConfig

document.querySelector('#sign-in-button').onclick = login
document.querySelector('#sign-out-button').onclick = logout

export function logout() {
  window.walletConnection.signOut()
  window.location.replace(window.location.origin + window.location.pathname)
}

export function login() {
  window.walletConnection.requestSignIn(nearConfig.contractName)
}


window.nearInitPromise = initContract()
  .then(() => {
    if (window.walletConnection.isSignedIn()) signedInFlow()
    else signedOutFlow()
  })
  .catch(console.error)

function signedOutFlow() {
  document.querySelector('#signed-out-flow').style.display = 'block'
}

function signedInFlow() {
  document.querySelector('#signed-in-flow').style.display = 'block'

  document.querySelectorAll('[data-behavior=account-id]').forEach(el => {
    el.innerText = window.accountId
  })

  const accountLink = document.querySelector('[data-behavior=notification] a:nth-of-type(1)')
  accountLink.href = accountLink.href + window.accountId
  accountLink.innerText = '@' + window.accountId
  const contractLink = document.querySelector('[data-behavior=notification] a:nth-of-type(2)')
  contractLink.href = contractLink.href + window.contract.contractId
  contractLink.innerText = '@' + window.contract.contractId

  accountLink.href = accountLink.href.replace('testnet', networkId)
  contractLink.href = contractLink.href.replace('testnet', networkId)

  mainFlow()

}