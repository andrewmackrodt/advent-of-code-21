"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partTwo = exports.partOne = exports.solve = void 0;
const fs_1 = require("fs");
function solve(input, days) {
    const state = new Array(9).fill(0);
    input.split(',').map(s => {
        const timer = parseInt(s, 10);
        state[timer]++;
    });
    for (let d = 0; d < days; d++) {
        const spawn = state.shift();
        state[6] += spawn;
        state.push(spawn);
    }
    return state.reduce((res, cur) => res + cur);
}
exports.solve = solve;
//region internal
const partOne = (input) => solve(input, 80);
exports.partOne = partOne;
const partTwo = (input) => solve(input, 256);
exports.partTwo = partTwo;
// print solution to terminal if invoked directly
if (require.main === module) {
    const input = (0, fs_1.readFileSync)(__dirname + '/input.txt').toString();
    console.log((0, exports.partOne)(input));
    console.log((0, exports.partTwo)(input));
}
//endregion
