import { readFileSync } from 'fs'

export function solve(input: string[]): number {
    let x = 0, y = 0
    for (const movement of input) {
        const [direction, stepsStr] = movement.split(' ')
        const steps = parseInt(stepsStr)
        if (direction === 'forward') x += steps
        else if (direction === 'down') y += steps
        else if (direction === 'up') y -= steps
    }
    return x * y
}

// print solution to terminal if invoked directly
if (require.main === module) {
    const input = readFileSync(__dirname + '/input.txt')
        .toString()
        .split('\n')
        .filter(s => s.length > 0)

    console.log(solve(input))
}