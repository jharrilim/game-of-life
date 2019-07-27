# game-of-life

Conway's Game of Life in a terminal.

## Usage

With `npx`

```sh
npx @jharrilim/game-of-life
```

or

```sh
npm i @jharrilim/game-of-life
game-of-life
```

or

```js
const { ConsoleMap } = require('@jharrilim/game-of-life');

const app = new ConsoleMap().seed(30);
app.on('cycle', cycleCount => {
    app.render();
});

setInterval(() => {
    app.cycle();
}, 1000 / 33);
```
