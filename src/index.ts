interface Point {
    x: number;
    y: number;
}

class Cell {
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

class CellMap {
    private _cells: Cell[][] = [];
    private _cycles: number = 0;

    constructor(private _width: number, private _height: number) {
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
        const widthDiff = width - this._width;
        const heightDiff = height - this._height;
        if (widthDiff > 0) { // Add new columns if width has been expanded
            // This fills out the box on the right
            for (let col = this._width; col < width; col++)
                for (let row = 0; row < this._height; row++)
                    this._cells[col][row] = new Cell(col, row);
        }
        if (heightDiff > 0) { // Add new rows if height has been expanded
            // This fills out the box on the bottom
            for (let col = 0; col < this._width; col++)
                for (let row = this._height; row < height; row++)
                    this._cells[col][row] = new Cell(col, row);
        }
        if (widthDiff > 0 && heightDiff > 0) { // Add the box in the bottom right corner if both sizes changed
            for (let col = this._width; col < width; col++)
                for (let row = this._height; row < height; row++)
                    this._cells[col][row] = new Cell(col, row);
        }

        if (widthDiff < 0) { // If width shrunk, remove columns
            this._cells.splice(-1, Math.abs(widthDiff));
        }

        if (heightDiff < 0) {
            for(let col = 0; col < this._width; col++) {
                this._cells[col].splice(-1, Math.abs(heightDiff));
            }
        }
        
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

    seed(initialSeed?: Point[]) {
        if (!initialSeed)
            for (let col = 0; col < this._width; col++)
                for (let row = 0; row < this._height; row++)
                    if (Math.round(Math.random()) === 1)
                        this._cells[col][row].live();
                    else
                        this._cells[col][row].die();
        else
            for (const point of initialSeed)
                this._cells[point.x][point.y].live();
    }

    cycle() {
        const newState = this._cells.map(col => [...col]);
        newState.forEach(col => col.forEach(cell => this._applyCellRules));
        this._cells = newState;
        this._cycles++;
    }

    _applyCellRules(cell: Cell) {
        const { x, y } = cell.position;
        const cells = this.cellSurroundings(x, y);
        const aliveSurroundings = cells.reduce((prev, curr) => prev + (curr.isAlive ? 1 : 0), 0);
        if (aliveSurroundings < 2)
            cell.die(); // Underpopulated
        else if (cell.isAlive && aliveSurroundings === 2)
            cell.live(); // Unchanged
        else if (aliveSurroundings === 3)
            cell.live(); // Rebirth if dead
        else if (aliveSurroundings > 3)
            cell.die(); // Overpopulated
        else throw new Error(`Unexpected error in _applyCellRules.\naliveSurroundings:\n\t${aliveSurroundings}\ncell:\n${JSON.stringify(cell, null, 2)}`);
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
