"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partTwo = exports.partOne = exports.solve = void 0;
const fs_1 = require("fs");
function solve(input, options) {
    const movements = input.split('\n').filter(s => s.length > 0);
    let x = 0, y = 0, z = 0;
    for (const movement of movements) {
        const [direction, stepsStr] = movement.split(' ');
        const steps = parseInt(stepsStr);
        if (direction === 'forward') {
            x += steps;
            y += z * steps;
        }
        else if (direction === 'down') {
            z += steps;
        }
        else if (direction === 'up') {
            z -= steps;
        }
    }
    return (options === null || options === void 0 ? void 0 : options.method) === 'accurate' ? x * y : x * z;
}
exports.solve = solve;
//region internal
const partOne = (input) => solve(input);
exports.partOne = partOne;
const partTwo = (input) => solve(input, { method: 'accurate' });
exports.partTwo = partTwo;
// print solution to terminal if invoked directly
if (require.main === module) {
    const input = (0, fs_1.readFileSync)(__dirname + '/input.txt').toString();
    console.log((0, exports.partOne)(input));
    console.log((0, exports.partTwo)(input));
}
//endregion
