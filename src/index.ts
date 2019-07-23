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
        for (let col = 0; col < this._width; col++)
            for (let row = 0; row < this._height; row++)
                this._cells[col][row] = new Cell(col, row);
    }

    cellAt(x: number, y: number): Cell {
        if (x === -1) {
            x = this._width; // If x went past the left wall, go to the right wall
        }
        if (x === this._width + 1) {
            x = 0; // If x went past the right wall, go to the left wall
        }
        if (y === -1) {
            y = this._height; // If y went past the top wall, go to the bottom wall
        }
        if (y === this._height + 1) {
            y = 0; // If y went past the bottom wall, go to the top wall
        }
        return this._cells[x][y];
    }

    resize(width: number, height: number) {
        this._width = width;
        this._height = height;
    }

    cellSurroundings(x: number, y: number): Cell[] {
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