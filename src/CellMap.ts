import { Cell } from "./Cell";
import { EventEmitter } from "events";
import { Point } from "./Point";

export abstract class CellMap extends EventEmitter {
    private _cells: Cell[][];
    private _cycles: number;

    get cells() {
        return this._cells;
    }

    constructor(private _width: number, private _height: number) {
        super();
        this._cells = [];
        this._cycles = 0;
        for (let col = 0; col < this._width; col++) {
            this._cells[col] = [];
            for (let row = 0; row < this._height; row++) {
                this._cells[col][row] = new Cell(col, row);
            }
        }
    }

    cellAt(x: number, y: number): Cell {
        if (x === -1) {
            x = this._width -1; // If x went past the left wall, go to the right wall
        }
        if (x === this._width) {
            x = 0; // If x went past the right wall, go to the left wall
        }
        if (y === -1) {
            y = this._height -1; // If y went past the top wall, go to the bottom wall
        }
        if (y === this._height) {
            y = 0; // If y went past the bottom wall, go to the top wall
        }
        return this._cells[x][y];
    }

    resize(width: number, height: number) {
        const widthDiff = width - this._width;
        const heightDiff = height - this._height;
        if (widthDiff > 0) { // Add new columns if width has been expanded
            // This fills out the box on the right
            for (let col = this._width; col < width; col++) {
                this._cells[col] = [];
                for (let row = 0; row < this._height; row++)
                    this._cells[col][row] = new Cell(col, row);
            }
        }
        if (heightDiff > 0) { // Add new rows if height has been expanded
            // This fills out the box on the bottom
            for (let col = 0; col < this._width; col++)
                for (let row = this._height; row < height; row++)
                    this._cells[col][row] = new Cell(col, row);
        }
        if (widthDiff > 0 && heightDiff > 0) { // Add the box in the bottom right corner if both sizes changed
            for (let col = this._width; col < width; col++) {
                this._cells[col] = [];
                for (let row = this._height; row < height; row++)
                    this._cells[col][row] = new Cell(col, row);
            }
        }

        if (widthDiff < 0) { // If width shrunk, remove columns
            this._cells.splice(-1, Math.abs(widthDiff));
        }

        if (heightDiff < 0) {
            for (let col = 0; col < this._width; col++) {
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
        newState.forEach(col => col.forEach(this._applyCellRules.bind(this)));
        this._cells = newState;
        this._cycles++;
        this.emit('cycle', this._cycles);
    }


    private _applyCellRules(cell: Cell) {
        const { x, y } = cell.position;
        const cells = this.cellSurroundings(x,y);
        const aliveSurroundings = cells.reduce((prev, curr) => prev + (curr.isAlive ? 1 : 0), 0);
        if (aliveSurroundings < 2)
            cell.die();  // Underpopulated
        else if (aliveSurroundings === 2)
            return;      // Unchanged
        else if (aliveSurroundings === 3)
            cell.live(); // Rebirth if dead
        else if (aliveSurroundings > 3)
            cell.die();  // Overpopulated
        else throw new Error(`Unexpected error in _applyCellRules.\naliveSurroundings:\n\t${aliveSurroundings}\ncell:\n${JSON.stringify(cell, null, 2)}`);
    }
}
