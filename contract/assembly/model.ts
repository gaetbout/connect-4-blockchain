import { PersistentVector, logging, RNG } from 'near-sdk-as'

@nearBindgen
export class Game {
    player: string
    playerMove: PersistentVector<String>
    aiMove: PersistentVector<String>
    arrayOfPawns: PersistentVector<i8>

    constructor(player: string) {
        this.player = player
        this.playerMove = new PersistentVector<String>(`${player}pl5`)
        this.aiMove = new PersistentVector<String>(`${player}ai5`)
        this.arrayOfPawns = new PersistentVector<i8>(`${player}piles5`)
        for (let i = 0; i < 7; i++) {
            this.arrayOfPawns.push(0)
        }
    }

    delete(): void {
        this._emptyI8(this.arrayOfPawns)
        this._empty(this.playerMove)
        this._empty(this.aiMove)
    }

    _empty(vectorToEmpty: PersistentVector<String>): void {
        if (vectorToEmpty.isEmpty) {
            return
        }
        vectorToEmpty.pop()
        this._empty(vectorToEmpty)
    }

    _emptyI8(vectorToEmpty: PersistentVector<i8>): void {
        if (vectorToEmpty.isEmpty) {
            return
        }
        vectorToEmpty.pop()
        this._emptyI8(vectorToEmpty)
    }

    isPlayerPlaying(player: string): boolean {
        return this.player == player
    }

    name(): string {
        return `${this.player}`
    }

    playAtColumn(column: i8): void {
        assert(!this._isBoardFull(), `There is no more tokens in to play with`)
        let possibleMoves = this._getPossibleMoves()
        assert(possibleMoves.includes(column), `The column ${column} is already full try another one`)
        this._playAtColumn(column, this.playerMove)
        const rng = new RNG<i8>(1, possibleMoves.length);
        let rngNext = abs(rng.next())
        logging.log(rngNext)
        let randomColumn = i8(possibleMoves[rngNext])
        logging.log(randomColumn)
        this._playAtColumn(randomColumn, this.aiMove)
    }

    getGameCoordinates(): string {
        let possibleMoves = this._getPossibleMoves()
        let gameState = this._getGameState()
        return `{"gameState":"${gameState}","coordinates":{"playerCoords":${this._displayMoves(this.playerMove)}, "aiCoords":${this._displayMoves(this.aiMove)}}, "possibleMoves":[${possibleMoves.toString()}]}`
    }

    _getGameState(): String {
        if (this._isBoardFull()) {
            return "BOARD_FULL"
        }
        return "PLAYING"
    }
    _playAtColumn(column: i8, vector: PersistentVector<String>): void {
        let row = this._numberOfMoveFor(column, this.playerMove)
        row += this._numberOfMoveFor(column, this.aiMove)
        vector.push(`${column},${row}`)
        this.arrayOfPawns[column]++
    }

    _getPossibleMoves(): Array<i32> {
        let array = new Array<i32>()
        for (let idx = 0; idx < this.arrayOfPawns.length; idx++) {
            if (this.arrayOfPawns[idx] < 7) {
                // logging.log(`Pushing: ${idx}`)
                array.push(idx)
            }
        }
        return array
    }

    _isBoardFull(): boolean {
        return (this.playerMove.length + this.aiMove.length) >= 42 // 21 tokens *2
    }

    _numberOfMoveFor(column: i8, aVector: PersistentVector<String>): i8 {
        let response: i8 = 0
        for (let idx = 0; idx < aVector.length; idx++) {
            if (i8(parseInt(aVector[idx].at(0))) == column) {
                response++
            }
        }
        return response
    }

    _displayMoves(aVector: PersistentVector<String>): string {
        let str = "";
        for (let idx = 0; idx < aVector.length; idx++) {
            str += `[${aVector[idx]}],`
        }
        return '[' + (str.substring(0, str.length - 1)) + ']'
    }
}
