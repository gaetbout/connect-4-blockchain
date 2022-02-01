import { PersistentVector, logging } from 'near-sdk-as'

@nearBindgen
export class Game {
    player: string
    map: Map

    constructor(player: string) {
        logging.log(`Creating game for: ${player}`)
        this.player = player
        this.map = new Map()
    }

    isPlayerPlaying(player: string): boolean {
        logging.log(`playerAccount: ${player}`)
        return this.player == player
    }

    name(): string {
        return `${this.player}`
    }

    playAtColumn(column: i8): void {
        this.map.playAtColumn(column)
    }

    getGameCoordinates(): string {
        return this.map.toString()
    }
}

class Map {

    playerMove: PersistentVector<Coordinates>
    aiMove: PersistentVector<Coordinates>

    constructor() {
        this.playerMove = new PersistentVector<Coordinates>("player")
        this.aiMove = new PersistentVector<Coordinates>("ai")
    }
    playAtColumn(column: i8): void {
        let countColumn = this._numberOfMoveFor(column, this.playerMove)
        countColumn += this._numberOfMoveFor(column, this.aiMove)
        //TODO ??? si l'ia joue dehors 
        this.playerMove.push(new Coordinates(column, countColumn))
    }

    _numberOfMoveFor(column: i8, aVector: PersistentVector<Coordinates>): i8 {
        let response: i8 = 1
        for (let idx = 0; idx < aVector.length; idx++) {
            if (aVector[idx].isColumEqualTo(column)) {
                response++
            }
        }
        return response
    }
    toString(): string {
        return `{"playerCoordinates":${this._displayMoves(this.playerMove)}, "aiCoordinates":${this._displayMoves(this.aiMove)}}`
    }

    _displayMoves(aVector: PersistentVector<Coordinates>): string {
        let str = "";
        for (let idx = 0; idx < aVector.length; idx++) {
            str += aVector[idx].toString() + ","
        }
        return '[' + (str.substring(0, str.length - 1)) + ']'
    }
}
class Coordinates {
    x: i8
    y: i8
    static upperLimit: i8 = 7
    static lowerLimit: i8 = 7

    constructor(x: i8, y: i8) {
        if (this.checkIsValidCoordinates(x) && this.checkIsValidCoordinates(y)) {
            this.x = x
            this.y = y
        };
    }
    checkIsValidCoordinates(aNumber: i8): boolean {
        assert(aNumber > 0, 'The column must be between 1 and 7')
        assert(aNumber < 8, 'The column must be between 1 and 7')
        return true;
    }

    isColumEqualTo(aNumber: i8): boolean {
        return this.x == aNumber
    }

    toString(): string {
        return `[${this.x},${this.y}]`
    }

}   
