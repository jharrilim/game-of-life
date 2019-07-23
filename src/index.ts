class Cell {
    private _state: boolean;
    private _position: { x: number, y: number };

    constructor(x: number, y: number) {
        this._state = false;
        this._position = { x, y };
    }

    get position() {
        return this._position;
    }
}

class CellMap {
    private _cells: Cell[][];

    constructor(private _width: number, private _height: number) {
        this._cells = [];
    }

    cellAt(x: number, y: number) {
        return this._cells[x][y];
    }

    resize(width: number, height: number) {
        this._width = width;
        this._height = height;
    }

    cellSurroundings(x: number, y: number) {
        return [
            this.cellAt(x, y + 1),     // Up
            this.cellAt(x, y - 1),     // Down
            this.cellAt(x - 1, y + 1), // Top Left
            this.cellAt(x + 1, y + 1), // Top Right
            this.cellAt(x - 1, y - 1), // Bottom Left
            this.cellAt(x + 1, y - 1), // Bottom Right
            this.cellAt(x - 1, y),     // Left
            this.cellAt(x + 1, y)      // Right
        ];
    }
}

class ConsoleMap extends CellMap {
    constructor() {
        super(
            process.stdout.columns || 80,
            process.stdout.rows || 24
        );

        process.stdout.on('resize', () => {
            this.resize(process.stdout.columns || 80, process.stdout.rows || 24);
        });
    }

}