import { createGame, getGame, getGameCoordinates, playAtColumn } from '..'
import { Context } from 'near-sdk-as'


describe('playAtColumn', () => {
    it('checks that the correct coordinates are correctly added', () => {
        createGame()
        let game = getGame(Context.sender)
        playAtColumn('0')
        expect(game.playerMove[0]).toBe('0,0')
        expect(game.playerMove.length).toBe(1)
        expect(game.aiMove.length).toBe(1)
        expect(game.arrayOfPawns.length).toBe(7)
    })
})


describe('playAtColumn play max (7) on same column (0)', () => {
    it('expect an error with argument (0) to be triggered', () => {
        createGame()
        let game = getGame(Context.sender)
        while (game._getPossibleMoves()[0] == 0) {
            playAtColumn('0')
        }
        expect(() => { playAtColumn('0') }).toThrow('The column 0 is already full try another one')
    })
})


describe('playAtColumn play max (7) on same column (2)', () => {
    it('expect an error with argument (2) to be triggered', () => {
        createGame()
        let game = getGame(Context.sender)
        while (game._getPossibleMoves()[2] == 2) {
            playAtColumn('2')
        }
        expect(() => { playAtColumn('2') }).toThrow('The column 2 is already full try another one')
    })
})

describe('_numberOfMoveFor (0)', () => {
    it('expect number of move to not contain 0', () => {
        createGame()
        let game = getGame(Context.sender)
        while (game._getPossibleMoves()[0] == 0) {
            playAtColumn('0')
        }
        expect(game._getPossibleMoves().includes(0)).toBeFalsy()
    })
})

describe('_numberOfMoveFor (3)', () => {
    it('expect number of move to not contain 0', () => {
        createGame()
        let game = getGame(Context.sender)
        while (game._getPossibleMoves()[3] == 3) {
            playAtColumn('3')
        }
        expect(game._getPossibleMoves().includes(3)).toBeFalsy()
    })
})

describe('game delete', () => {
    it('expect all arrays to be empty', () => {
        createGame()
        let game = getGame(Context.sender)
        playAtColumn('0')
        playAtColumn('0')
        playAtColumn('0')
        expect(game.playerMove.length).toBe(3)
        expect(game.aiMove.length).toBe(3)
        expect(game.arrayOfPawns.length).toBe(7)
        game.delete()
        expect(game.playerMove.length).toBe(0)
        expect(game.aiMove.length).toBe(0)
        expect(game.arrayOfPawns.length).toBe(0)

    })
})


describe('playAtColumn the max number of token', () => {
    it('play 21 times then ensures that the board is full', () => {
        createGame()
        let game = getGame(Context.sender)
        for (let i = 0; i < 21; i++) {
            playAtColumn(game._getPossibleMoves()[0].toString())
        }
        expect(() => { playAtColumn('0') }).toThrow('There is no more tokens in to play with')
        expect(game._getGameState()).toBe('BOARD_FULL')
        expect(game._isBoardFull()).toBeTruthy()
        expect(game.getGameCoordinates().includes('"gameState":"BOARD_FULL"')).toBeTruthy()
    })
})


describe('getGameCoordinates on empty game', () => {
    it('should return an empty json with gameState, coordinates and possibleMoves', () => {
        createGame()
        let json = `{"gameState":"PLAYING","coordinates":{"playerCoords":[], "aiCoords":[]}, "possibleMoves":[0,1,2,3,4,5,6]}`
        expect(getGame(Context.sender).getGameCoordinates()).toBe(json)
    })
})