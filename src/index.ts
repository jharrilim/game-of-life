import { ConsoleMap } from './ConsoleMap';


const app = new ConsoleMap();
app.seed();
app.on('cycle', function(cycleCount) {
    app.render();
});

setInterval((function(app) {
    return function() {
        app.cycle();
    }
})(app), 200);
