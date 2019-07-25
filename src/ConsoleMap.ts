import { CellMap } from "./CellMap";

export class ConsoleMap extends CellMap {
    private _listeners: CallableFunction[];
    constructor() {
        super(
            process.stdout.columns || 80,
            process.stdout.rows || 24
        );

        this._listeners = [];
        process.stdout.on('resize', () => {
            this.resize(process.stdout.columns || 80, process.stdout.rows || 24);
        });
    }

}
