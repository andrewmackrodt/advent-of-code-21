"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partTwo = exports.partOne = exports.solve = void 0;
const fs_1 = require("fs");
const calc = {
    median: (values) => {
        const sorted = values.sort((a, b) => a - b);
        if (sorted.length % 2 === 0) {
            const rightIndex = sorted.length / 2;
            const sum = sorted[rightIndex - 1] + sorted[rightIndex];
            return sum / 2;
        }
        else {
            return sorted[Math.floor(sorted.length / 2)];
        }
    },
    sum: (values) => {
        return values.reduce((res, cur) => res + cur, 0);
    },
};
function solve(input, options) {
    const positions = input.split(',').map(s => parseInt(s, 10)).sort((a, b) => a - b);
    const totalCost = (cost) => {
        return calc.sum(positions.map(p => cost(p)));
    };
    switch (options === null || options === void 0 ? void 0 : options.burn) {
        case 'linear':
            const cost = (startingPosition, endingPosition) => {
                let change = Math.abs(startingPosition - endingPosition);
                for (let i = 1, len = change; i < len; i++) {
                    change += i;
                }
                return change;
            };
            const mean = calc.sum(positions) / positions.length;
            if (mean % 2 !== 0) {
                const min = totalCost((p) => cost(p, Math.floor(mean)));
                const max = totalCost((p) => cost(p, Math.ceil(mean)));
                return Math.min(min, max);
            }
            else {
                return totalCost((p) => cost(p, mean));
            }
        default:
            const median = calc.median(positions);
            return totalCost(p => Math.abs(p - median));
    }
}
exports.solve = solve;
//region internal
const partOne = (input) => solve(input);
exports.partOne = partOne;
const partTwo = (input) => solve(input, { burn: 'linear' });
exports.partTwo = partTwo;
// print solution to terminal if invoked directly
if (require.main === module) {
    const input = (0, fs_1.readFileSync)(__dirname + '/input.txt').toString();
    console.log((0, exports.partOne)(input));
    console.log((0, exports.partTwo)(input));
}
//endregion
