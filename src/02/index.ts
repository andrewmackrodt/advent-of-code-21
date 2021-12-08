import { readFileSync } from 'fs'

interface Options {
    method?: 'original' | 'accurate'
}

export function solve(input: string[], options?: Options): number {
    if ( ! options?.method) console.warn('calling solve without specifying options.method is deprecated')
    let x = 0, y = 0, z = 0
    for (const movement of input) {
        const [direction, stepsStr] = movement.split(' ')
        const steps = parseInt(stepsStr)
        if (direction === 'forward') {
            x += steps
            y += z * steps
        } else if (direction === 'down') {
            z += steps
        } else if (direction === 'up') {
            z -= steps
        }
    }
    return options?.method === 'accurate' ? x * y : x * z
}

// print solution to terminal if invoked directly
if (require.main === module) {
    const input = readFileSync(__dirname + '/input.txt')
        .toString()
        .split('\n')
        .filter(s => s.length > 0)

    console.log(solve(input))
    console.log(solve(input, { method: 'accurate' }))
}