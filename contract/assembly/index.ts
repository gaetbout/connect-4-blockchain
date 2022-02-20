import { Context, storage } from 'near-sdk-as'
import { Game } from './model'


export function createGame(): void {
  const accountId = Context.sender
  assert(!isInGame(accountId), `Player ${accountId} is already in a game`)
  let newGame = new Game(accountId)
  storage.set(accountId, newGame)
}

export function getGame(player: string): Game {
  assert(isInGame(player), `Player ${player} isn't in a game`)
  return storage.getSome<Game>(player);
}

export function deleteGame(): void {
  const accountId = Context.sender
  getGame(Context.sender).delete()
  storage.delete(accountId)
}

export function isInGame(accountId: string): bool {
  return storage.contains(accountId)
}

export function getGameCoordinates(accountId: string): string {
  return getGame(accountId).getGameCoordinates()
}

export function playAtColumn(columnString: string): void {
  let column: i8 = i8(parseInt(columnString))
  getGame(Context.sender).playAtColumn(column)
}