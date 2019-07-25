import { Point } from "./Point";

export class Cell {
    private _state: boolean;
    private _position: Point;

    constructor(x: number, y: number) {
        this._state = false;
        this._position = { x, y };
    }

    get position() {
        return this._position;
    }

    get isAlive() {
        return this._state;
    }

    die() {
        this._state = false;
    }

    live() {
        this._state = true;
    }
}
