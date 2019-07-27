import { ConsoleMap } from './ConsoleMap';
import { clearScreenDown } from 'readline';

export { ConsoleMap };

// const lwss = `
//  ■■■■
// ■   ■
//     ■
// ■  ■
// `.split('');
// lwss.shift();
// TODO: Convert strings like this into Point arrays

export function start() {
    const app = new ConsoleMap();
    const seed = Number.parseInt(process.argv.pop()!) || 30;
    
    app.seed(seed);
    
    app.on('cycle', function (cycleCount) {
        app.render();
    });
    
    setInterval(() => {
        app.cycle();
    }, 1000 / 33);
    
    process.on('SIGTERM', () => {
        clearScreenDown(process.stdout);
        process.exit(0);
    });
    
    process.on('SIGINT', () => {
        clearScreenDown(process.stdout);
        process.exit(0);
    });
}

if (require.main === module) {
    start();
}
