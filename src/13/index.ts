import { readFileSync } from 'fs'

interface Point {
    x: number
    y: number
}

interface Fold {
    axis: 'x' | 'y'
    value: number
}

function parseInput(input: string): { points: Point[]; folds: Fold[] } {
    const points: Point[] = []
    const folds: Fold[] = []

    const [strPoints, strFolds] = input.split('\n\n').map(s => s.split('\n'))

    strPoints.map(s => {
        const [x, y] = s.split(',').map(s => parseInt(s, 10))
        points.push({ x, y })
    })

    strFolds.map(s => {
        const match = s.match(/(?<axis>[xy])=(?<value>[0-9]+)/)
        if ( ! match?.groups) return
        folds.push({
            axis: match.groups.axis,
            value: parseInt(match.groups.value, 10),
        } as Fold)
    })

    return { points, folds }
}

function createState(points: Point[]): number[][] {
    const state: number[][] = []
    for (
        let width = 1 + points.reduce((res, p) => Math.max(res, p.x), 0),
            height = 1 + points.reduce((res, p) => Math.max(res, p.y), 0),
            y = 0;
        y < height;
        y++
    ) {
        state.push(new Array(width).fill(0))
    }
    for (const point of points) {
        state[point.y][point.x] = 1
    }
    return state
}

function fold(state: number[][], folds: Fold[]): void {
    for (const fold of folds) {
        switch (fold.axis) {
            case 'x':
                for (let y = 0; y < state.length; y++) {
                    const right = state[y].splice(fold.value).reverse()
                    for (let x = 0; x < state[0].length; x++) {
                        if (right[x] > 0) {
                            state[y][x]++
                        }
                    }
                }
                break
            case 'y':
                const bottom = state.splice(fold.value).reverse()
                for (let y = 0; y < state.length; y++) {
                    for (let x = 0; x < state[0].length; x++) {
                        if (bottom[y][x] > 0) {
                            state[y][x]++
                        }
                    }
                }
                break
        }
    }
}

function parseState(input: string, foldLimit?: number | undefined): number[][] {
    const { points, folds } = parseInput(input)
    const state = createState(points)
    fold(state, folds.slice(0, foldLimit))
    return state
}

export function getVisibleDotCount(input: string, foldLimit?: number | undefined): number {
    return parseState(input, foldLimit).reduce((total, row) => (
        total + row.reduce((rowTotal, cell) => rowTotal + Math.min(cell, 1), 0)
    ), 0)
}

export function getCode(input: string): string {
    return parseState(input).map(y => y.map(v => v ? '#' : ' ').join('')).join('\n')
}

//region internal
export const partOne = (input: string) => getVisibleDotCount(input, 1)
export const partTwo = (input: string) => getCode(input)

// print solution to terminal if invoked directly
if (require.main === module) {
    const input = readFileSync(__dirname + '/input.txt').toString()
    console.log(partOne(input))
    console.log(partTwo(input))
}
//endregion