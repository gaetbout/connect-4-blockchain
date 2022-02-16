import { createGame, isInGame, deleteGame, getGame, getGameCoordinates } from '..'
import { Game } from '../model'
import { storage, Context } from 'near-sdk-as'

describe('createGame ', () => {
  it('should create a game and check that it exists in the storage', () => {
    createGame()
    expect(storage.get<Game>(Context.sender)).not.toBeNull()
  })
})

describe('createGame twice', () => {
  it('create a game twice, should trigger an assertion to fail', () => {
    createGame()
    expect(createGame).toThrow(`Player ${Context.sender} is already in a game`)
  })
})


describe('getGame', () => {
  it('get game and check player name', () => {
    createGame()
    expect(getGame(Context.sender).player).toBe(Context.sender)
  })
})

describe('getGame for non existing game', () => {
  it('get game when no game created should trigger an assertion to fail', () => {
    expect(() => { getGame(Context.sender) }).toThrow(`Player ${Context.sender} isn't in a game`)
  })
})


describe('deleteGame', () => {
  it('should delete the game of the user', () => {
    createGame()
    deleteGame()
    expect(
      storage.get<Game>(Context.sender)).toBeNull()
  })
})


describe('isInGame', () => {
  it('check if a user is in game', () => {
    createGame()
    expect(isInGame).toBeTruthy()
  })
})

describe('isInGame not in game', () => {
  it('the player shouldn\'t be in game', () => {
    expect(isInGame(Context.sender)).toBeFalsy()
  })
})
describe('getGameCoordinates on empty game', () => {
  it('should return an empty json with gameState, coordinates and possibleMoves', () => {
    createGame()
    let json = `{"gameState":"PLAYING","coordinates":{"playerCoords":[], "aiCoords":[]}, "possibleMoves":[0,1,2,3,4,5,6]}`
    expect(getGame(Context.sender).getGameCoordinates()).toBe(json)
  })
})
