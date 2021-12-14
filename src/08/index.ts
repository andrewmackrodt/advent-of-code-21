import { readFileSync } from 'fs'

export function solve(input: string): number {
    let result = 0

    for (const line of input.split('\n')) {
        const [signal, output] = line.split(' | ').map(s => s.split(' '))

        result += output.filter(o => [2, 3, 4, 7].includes(o.length)).length
    }

    return result
}

// print solution to terminal if invoked directly
if (require.main === module) {
    const input = readFileSync(__dirname + '/input.txt').toString()

    console.log(solve(input))
}