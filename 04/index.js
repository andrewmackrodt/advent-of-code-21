"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partTwo = exports.partOne = exports.getLosingBoardScore = exports.getWinningBoardScore = void 0;
const fs_1 = require("fs");
function* generator(input) {
    const lines = input.split('\n\n');
    const picks = lines.shift().split(',').map(s => parseInt(s, 10));
    let boards = lines.map(board => (board.split('\n')
        .map(line => line.split(/ +/)
        .filter(s => s.length > 0)
        .map(s => parseInt(s.trim(), 10)))));
    const markNumberAndGetScoreIfBoardComplete = (pick, board) => {
        // HADOKEN =D
        for (let y = 0; y < board.length; y++) {
            const line = board[y];
            for (let x = 0; x < line.length; x++) {
                const num = line[x];
                if (num === pick) {
                    line[x] = NaN;
                    if (line.filter(n => !isNaN(n)).length === 0 ||
                        board.map(line => line[x]).filter(n => !isNaN(n)).length === 0) {
                        const sumUnmarked = board.flat()
                            .filter(n => !isNaN(n))
                            .reduce((res, cur) => res + cur, 0);
                        return sumUnmarked * pick;
                    }
                }
            }
        }
    };
    for (const pick of picks) {
        for (const board of boards) {
            const score = markNumberAndGetScoreIfBoardComplete(pick, board);
            if (typeof score === 'number') {
                boards = boards.filter(b => b !== board);
                yield score;
            }
        }
    }
    return 0;
}
function getWinningBoardScore(input) {
    return generator(input).next().value;
}
exports.getWinningBoardScore = getWinningBoardScore;
function getLosingBoardScore(input) {
    let lastScore = 0;
    for (const winningScore of generator(input)) {
        lastScore = winningScore;
    }
    return lastScore;
}
exports.getLosingBoardScore = getLosingBoardScore;
//region internal
const partOne = (input) => getWinningBoardScore(input);
exports.partOne = partOne;
const partTwo = (input) => getLosingBoardScore(input);
exports.partTwo = partTwo;
// print solution to terminal if invoked directly
if (require.main === module) {
    const input = (0, fs_1.readFileSync)(__dirname + '/input.txt').toString();
    console.log((0, exports.partOne)(input));
    console.log((0, exports.partTwo)(input));
}
//endregion
