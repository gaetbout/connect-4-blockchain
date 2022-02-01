import 'regenerator-runtime/runtime'

import { login, logout, } from './contractInteraction/login'
import { createGame, fetchIsInGame } from './contractInteraction/contract'

import getConfig from './config'

export function mainFlow() {
  fetchIsInGame()
}
