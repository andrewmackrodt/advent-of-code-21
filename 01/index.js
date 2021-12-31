"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partTwo = exports.partOne = exports.solve = void 0;
const fs_1 = require("fs");
function solve(input, windowSize = 1) {
    const depths = input.split('\n').filter(s => s.length > 0).map(s => parseInt(s));
    let previous = Number.MAX_SAFE_INTEGER;
    let count = 0;
    const window = depths.slice(0, windowSize - 1);
    for (let i = window.length; i < depths.length; i++) {
        window.push(depths[i]);
        const current = window.reduce((res, cur) => res + cur);
        if (current > previous) {
            count++;
        }
        previous = current;
        window.splice(0, 1);
    }
    return count;
}
exports.solve = solve;
//region internal
const partOne = (input) => solve(input);
exports.partOne = partOne;
const partTwo = (input) => solve(input, 3);
exports.partTwo = partTwo;
// print solution to terminal if invoked directly
if (require.main === module) {
    const input = (0, fs_1.readFileSync)(__dirname + '/input.txt').toString();
    console.log((0, exports.partOne)(input));
    console.log((0, exports.partTwo)(input));
}
//endregion
