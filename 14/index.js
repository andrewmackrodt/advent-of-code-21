"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partTwo = exports.partOne = exports.solve = void 0;
const fs_1 = require("fs");
function parse(input) {
    const [template, rulesString] = input.split('\n\n');
    return {
        template,
        rules: rulesString.split('\n')
            .map(str => str.split(' -> '))
            .reduce((res, [pair, value]) => {
            res[pair] = value;
            return res;
        }, {}),
    };
}
function solve(input, steps) {
    const { template, rules } = parse(input);
    const countByLetter = {};
    let countByPair = {};
    for (const pair of Object.keys(rules).sort()) {
        countByPair[pair] = 0;
        const [c1, c2] = pair.split('');
        countByLetter[c1] = 0;
        countByLetter[c2] = 0;
    }
    for (let i = 0; i < template.length - 1; i++) {
        const pair = template.substring(i, i + 2);
        countByPair[pair]++;
        const [c1, c2] = pair.split('');
        if (i === 0)
            countByLetter[c1]++;
        countByLetter[c2]++;
    }
    for (let step = 0; step < steps; step++) {
        const newCountByPair = Object.assign({}, countByPair);
        for (const [pair, count] of Object.entries(countByPair)) {
            if (count === 0)
                continue;
            const p1 = pair[0] + rules[pair];
            const p2 = rules[pair] + pair[1];
            newCountByPair[p1] += count;
            newCountByPair[p2] += count;
            newCountByPair[pair] -= count;
            countByLetter[rules[pair]] += count;
        }
        countByPair = newCountByPair;
    }
    const counts = Object.values(countByLetter).sort((a, b) => a - b);
    const min = counts[0];
    const max = counts[counts.length - 1];
    return max - min;
}
exports.solve = solve;
//region internal
const partOne = (input) => solve(input, 10);
exports.partOne = partOne;
const partTwo = (input) => solve(input, 40);
exports.partTwo = partTwo;
// print solution to terminal if invoked directly
if (require.main === module) {
    const input = (0, fs_1.readFileSync)(__dirname + '/input.txt').toString();
    console.log((0, exports.partOne)(input));
    console.log((0, exports.partTwo)(input));
}
//endregion
