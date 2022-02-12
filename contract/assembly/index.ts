import { Context, logging, storage } from 'near-sdk-as'
import { Game } from './model'


export function createGame(): void {
  const accountId = Context.sender
  let newGame = new Game(accountId)
  storage.set(accountId, newGame) 
  return
}

function _getGame(player: string): Game {
  return storage.getSome<Game>(player);
}

export function deleteGame(): void {
  logging.log(`${Context.prepaidGas.toString()}`)
  const accountId = Context.sender
  assert(isInGame(accountId), `Player ${accountId} isn't in a game`)
  _getGame(Context.sender).delete()
  storage.delete(accountId)
}

export function isInGame(accountId: string): bool {
  return storage.contains(accountId)
}

export function getGameCoordinates(accountId: string): string {
  assert(isInGame(accountId), `Player ${accountId} isn't in a game`)
  return _getGame(accountId).getGameCoordinates()
}
export function playAtColumn(columnString: string): void {
  assert(isInGame(Context.sender), `Player ${Context.sender} isn't in a game`)
  // logging.log(`playAtColumn: ${columnString}`)
  let column: i8 = i8(parseInt(columnString))
  _getGame(Context.sender).playAtColumn(column)
}