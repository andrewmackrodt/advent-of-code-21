"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partTwo = exports.partOne = exports.solve = void 0;
const fs_1 = require("fs");
var Tile;
(function (Tile) {
    Tile["EastSeaCucumber"] = ">";
    Tile["MovingEastSeaCucumber"] = "}";
    Tile["SouthSeaCucumber"] = "v";
    Tile["MovingSouthSeaCucumber"] = "V";
    Tile["Empty"] = ".";
    Tile["Transition"] = "!";
})(Tile || (Tile = {}));
function solve(input) {
    const grid = input.split('\n').map(line => line.split(''));
    const clearTransition = () => {
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                switch (grid[y][x]) {
                    case Tile.MovingEastSeaCucumber:
                        grid[y][x] = Tile.EastSeaCucumber;
                        break;
                    case Tile.MovingSouthSeaCucumber:
                        grid[y][x] = Tile.SouthSeaCucumber;
                        break;
                    case Tile.Transition:
                        grid[y][x] = Tile.Empty;
                        break;
                }
            }
        }
    };
    const step = () => {
        let moveCount = 0;
        // move east
        for (let y = 0; y < grid.length; y++) {
            for (let x = grid[y].length - 1; x >= 0; x--) {
                const x2 = x < grid[y].length - 1 ? x + 1 : 0;
                if (grid[y][x] === Tile.EastSeaCucumber && grid[y][x2] === Tile.Empty) {
                    grid[y][x] = Tile.Transition;
                    grid[y][x2] = Tile.MovingEastSeaCucumber;
                    moveCount++;
                }
            }
        }
        clearTransition();
        // move south
        for (let y = grid.length - 1; y >= 0; y--) {
            const y2 = y < grid.length - 1 ? y + 1 : 0;
            for (let x = 0; x < grid[y].length; x++) {
                if (grid[y][x] === Tile.SouthSeaCucumber && grid[y2][x] === Tile.Empty) {
                    grid[y][x] = Tile.Transition;
                    grid[y2][x] = Tile.MovingSouthSeaCucumber;
                    moveCount++;
                }
            }
        }
        clearTransition();
        return moveCount > 0;
    };
    let stepCount = 1;
    while (step())
        stepCount++;
    return stepCount;
}
exports.solve = solve;
//region internal
const partOne = (input) => solve(input);
exports.partOne = partOne;
const partTwo = (input) => undefined;
exports.partTwo = partTwo;
// print solution to terminal if invoked directly
if (require.main === module) {
    const input = (0, fs_1.readFileSync)(__dirname + '/input.txt').toString();
    console.log((0, exports.partOne)(input));
    console.log((0, exports.partTwo)(input));
}
//endregion
