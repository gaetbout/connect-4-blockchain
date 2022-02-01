import { Context, logging, storage, PersistentVector } from 'near-sdk-as'
import { Game } from './model'


export function createGame(): void {
  const accountId = Context.sender
  logging.log(`Creating game for account "${accountId}"`)
  let newGame = new Game(accountId)
  storage.set(accountId, newGame)
  return
}

function _getGame(player: string): Game {
  return storage.getSome<Game>(player);
}


//FAIRE UN BOUTON POUR TOUT DELETE


export function isInGame(player: string): bool {
  logging.log(`Checking if account "${player}" is in a game`)
  return storage.contains(player)
}

export function getGameCoordinates(player: string): string {
  assert(isInGame(player), `Player ${player} isn't in a game`)
  return _getGame(player).getGameCoordinates()
}
export function playAtColumn(columnString: string): void {
  assert(isInGame(Context.sender), `Player ${Context.sender} isn't in a game`)
  logging.log(`Player "${Context.sender}" trying to play at ${columnString}`)
  let column: i8 = i8(parseInt(columnString))
  logging.log(`Playing at:${column}`)
  _getGame(Context.sender).playAtColumn(column)
}