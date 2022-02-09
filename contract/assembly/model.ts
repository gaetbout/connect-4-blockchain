import { PersistentVector, logging } from 'near-sdk-as'

@nearBindgen
export class Game {
    player: string
    playerMove: PersistentVector<String>
    aiMove: PersistentVector<String>

    constructor(player: string) {
        this.player = player
        this.playerMove = new PersistentVector<String>(`${player}pl4`)
        this.aiMove = new PersistentVector<String>(`${player}ai4`)
    }
    delete(): void {
        this._empty(this.playerMove)
        this._empty(this.aiMove)
    }
    
    _empty(vectorToEmpty: PersistentVector<String>): void {
        if(vectorToEmpty.isEmpty){
            return
        }
        vectorToEmpty.pop()
        this._empty(vectorToEmpty)
    }
    isPlayerPlaying(player: string): boolean {
        return this.player == player
    }

    name(): string {
        return `${this.player}`
    }

    playAtColumn(column: i8): void {
        let row = this._numberOfMoveFor(column, this.playerMove)
        row += this._numberOfMoveFor(column, this.aiMove) + 1
        //TODO ??? si l'ia joue dehors 
        this.playerMove.push(`${column},${row}`)
        logging.log(`playAtColumn: ${this.getGameCoordinates()}`)
    }

    getGameCoordinates(): string {
        logging.log(`length: ${this.playerMove.length}`)
        return `{"playerCoords":${this._displayMoves(this.playerMove)}, "aiCoords":${this._displayMoves(this.aiMove)}}`
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
