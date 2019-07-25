import { ConsoleMap } from './ConsoleMap';


const app = new ConsoleMap();
app.on('cycle', function(cycleCount) {
    console.log(`cycle: ${cycleCount}`);
});

setInterval((function(app) {
    return function() {
        app.cycle();
    }
})(app), 1000);
