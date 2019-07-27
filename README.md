# game-of-life

[![NPM Version]](https://www.npmjs.com/package/@jharrilim/game-of-life)
[![NPM Downloads]](https://www.npmjs.com/package/@jharrilim/game-of-life)

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

[NPM Version]: https://img.shields.io/npm/v/@jharrilim/game-of-life?style=flat-square
[NPM Downloads]: https://img.shields.io/npm/dy/@jharrilim/game-of-life?style=flat-square
