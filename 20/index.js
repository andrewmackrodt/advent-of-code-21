"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partTwo = exports.partOne = exports.solve = void 0;
const fs_1 = require("fs");
function parseInput(input) {
    const parts = input.split('\n\n');
    return {
        algorithm: parts[0].replace(/\n/g, ''),
        image: parts[1].split('\n').map(s => s.split('').map(c => c === '#')),
    };
}
function enhanceImage(input, iterations) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    let outputImage = input.image;
    for (let i = 0; i < iterations; i++) {
        const inputImage = outputImage;
        const pad = 1;
        const a = (-1 - pad), b = (0 - pad), c = (1 - pad);
        const height = inputImage.length + (2 * pad);
        const width = inputImage[0].length + (2 * pad);
        const oob = i % 2 !== 0 && input.algorithm[0] === '#' && input.algorithm[511] === '.';
        outputImage = [];
        for (let y = 0; y < height; y++) {
            outputImage.push(new Array(width).fill(false));
            for (let x = 0; x < width; x++) {
                const pixels = [
                    (_b = (_a = inputImage[y + a]) === null || _a === void 0 ? void 0 : _a[x + a]) !== null && _b !== void 0 ? _b : oob,
                    (_d = (_c = inputImage[y + a]) === null || _c === void 0 ? void 0 : _c[x + b]) !== null && _d !== void 0 ? _d : oob,
                    (_f = (_e = inputImage[y + a]) === null || _e === void 0 ? void 0 : _e[x + c]) !== null && _f !== void 0 ? _f : oob,
                    (_h = (_g = inputImage[y + b]) === null || _g === void 0 ? void 0 : _g[x + a]) !== null && _h !== void 0 ? _h : oob,
                    (_k = (_j = inputImage[y + b]) === null || _j === void 0 ? void 0 : _j[x + b]) !== null && _k !== void 0 ? _k : oob,
                    (_m = (_l = inputImage[y + b]) === null || _l === void 0 ? void 0 : _l[x + c]) !== null && _m !== void 0 ? _m : oob,
                    (_p = (_o = inputImage[y + c]) === null || _o === void 0 ? void 0 : _o[x + a]) !== null && _p !== void 0 ? _p : oob,
                    (_r = (_q = inputImage[y + c]) === null || _q === void 0 ? void 0 : _q[x + b]) !== null && _r !== void 0 ? _r : oob,
                    (_t = (_s = inputImage[y + c]) === null || _s === void 0 ? void 0 : _s[x + c]) !== null && _t !== void 0 ? _t : oob,
                ];
                const bin = pixels.map(b => Number(b)).join('');
                const dec = parseInt(bin, 2);
                outputImage[y][x] = input.algorithm[dec] === '#';
            }
        }
    }
    return outputImage;
}
function solve(input, iterations) {
    const inputImage = parseInput(input);
    const outputImage = enhanceImage(inputImage, iterations);
    return outputImage.map(s => s.filter(b => b)).flat().length;
}
exports.solve = solve;
//region internal
const partOne = (input) => solve(input, 2);
exports.partOne = partOne;
const partTwo = (input) => solve(input, 50);
exports.partTwo = partTwo;
// print solution to terminal if invoked directly
if (require.main === module) {
    const input = (0, fs_1.readFileSync)(__dirname + '/input.txt').toString();
    console.log((0, exports.partOne)(input));
    console.log((0, exports.partTwo)(input));
}
//endregion
