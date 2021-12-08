import { readFileSync } from 'fs'

export function solve(input: number[], windowSize = 1): number {
    let previous = Number.MAX_SAFE_INTEGER
    let count = 0
    const window: number[] = input.slice(0, windowSize - 1)

    for (let i = window.length; i < input.length; i++) {
        window.push(input[i])
        const current = window.reduce((res, cur) => res + cur)

        if (current > previous) {
            count++
        }

        previous = current
        window.splice(0, 1)
    }

    return count
}

// print solution to terminal if invoked directly
if (require.main === module) {
    const input = readFileSync(__dirname + '/input.txt')
        .toString()
        .split('\n')
        .filter(s => s.length > 0)
        .map(s => parseInt(s))

    console.log(solve(input))
    console.log(solve(input, 3))
}