import { CellMap } from "./CellMap";
import { EOL } from 'os';
import { cursorTo, clearScreenDown } from 'readline';

export class ConsoleMap extends CellMap {
    constructor(
        private width = process.stdout.columns || 80,
        private height = process.stdout.rows || 24
    ) {
        super(width, height);
        process.stdout.on('resize', () => {
            this.resize(process.stdout.columns || 80, process.stdout.rows || 24);
        });
    }

    render() {
        cursorTo(process.stdout, 0, 0);
        clearScreenDown(process.stdout);
        let map = '';
        for(let i = 0; i < this.cells[0].length /* this should be safe since it is rectangular */; i++) {
            for (let j = 0; j < this.cells.length; j++) {
                const line = this.cells[j][i].isAlive ? '■' : ' ';
                map += line;
            }
            map += EOL;
        }
        process.stdout.write(map);
        cursorTo(process.stdout, 0, 0);
    }
}
