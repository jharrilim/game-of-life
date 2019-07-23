class Cell {
    private state: boolean;
    private position: { x: number, y: number };

    constructor() {
        this.state = false;
        this.position = { x: 0, y: 0 };
    }
}

class CellMap {
    private cells: Cell[][];

    constructor(private width: number, private height: number) {
        this.cells = [];
    }

    cellAt(x: number, y: number) {
        return this.cells[x][y];
    }

    resize(width: number, height: number) {
        this.width = width;
        this.height = height;
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
        })
    }

}