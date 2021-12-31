"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partTwo = exports.partOne = exports.solve = void 0;
const fs_1 = require("fs");
function solve(input, options) {
    const movements = input.split('\n')
        .filter(s => s.length > 0)
        .map(s => {
        const split = s.replace(/[^0-9,]+/, ',')
            .split(',')
            .map(s => parseInt(s));
        return Object.assign({}, ...['x1', 'y1', 'x2', 'y2'].map((key, i) => ({ [key]: split[i] })));
    });
    if (movements.length === 0) {
        return 0;
    }
    const numericSort = (a, b) => a - b;
    const width = movements.map(m => m.x1).concat(movements.map(m => m.x2)).sort(numericSort).pop() + 1;
    const height = movements.map(m => m.y1).concat(movements.map(m => m.y2)).sort(numericSort).pop() + 1;
    const field = new Array(height).fill(null).map(() => new Array(width).fill(0));
    for (const m of movements) {
        let yCount = Math.abs(m.y2 - m.y1) + 1;
        let xCount = Math.abs(m.x2 - m.x1) + 1;
        const isDiagonal = yCount !== 1 && xCount !== 1;
        if (isDiagonal) {
            if (yCount !== xCount) {
                throw new Error(`Invalid diagonal movement: ${JSON.stringify(m)}`);
            }
            if (!(options === null || options === void 0 ? void 0 : options.diagonal)) {
                continue;
            }
        }
        for (let x = m.x1, y = m.y1; yCount > 0 || xCount > 0;) {
            field[y][x]++;
            if (yCount-- > 1) {
                y = m.y1 > m.y2 ? y - 1 : y + 1;
            }
            if (xCount-- > 1) {
                x = m.x1 > m.x2 ? x - 1 : x + 1;
            }
        }
    }
    return field.flat().filter(n => n > 1).length;
}
exports.solve = solve;
//region internal
const partOne = (input) => solve(input);
exports.partOne = partOne;
const partTwo = (input) => solve(input, { diagonal: true });
exports.partTwo = partTwo;
// print solution to terminal if invoked directly
if (require.main === module) {
    const input = (0, fs_1.readFileSync)(__dirname + '/input.txt').toString();
    console.log((0, exports.partOne)(input));
    console.log((0, exports.partTwo)(input));
}
//endregion
