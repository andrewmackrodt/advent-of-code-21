import { readFileSync } from 'fs'

// PriorityQueue implementation - https://stackoverflow.com/a/42919752/650329
export class PriorityQueue<T> implements Iterable<T> {
    private static readonly TOP = 0
    private readonly heap: T[]
    private readonly comparator: (a: T, b: T) => boolean

    public constructor(comparator = (a: T, b: T) => a > b) {
        this.heap = []
        this.comparator = comparator
    }

    public get length(): number {
        return this.heap.length
    }

    public isEmpty(): boolean {
        return this.length == 0
    }

    public peek() {
        return this.heap[PriorityQueue.TOP]
    }

    public push(...values: T[]) {
        values.forEach(value => {
            this.heap.push(value)
            this.siftUp()
        })
        return this.length
    }

    public pop() {
        const poppedValue = this.peek()
        const bottom = this.length - 1
        if (bottom > PriorityQueue.TOP) {
            this.swap(PriorityQueue.TOP, bottom)
        }
        this.heap.pop()
        this.siftDown()
        return poppedValue
    }

    public replace(value: T) {
        const replacedValue = this.peek()
        this.heap[PriorityQueue.TOP] = value
        this.siftDown()
        return replacedValue
    }

    private greater(i: number, j: number) {
        return this.comparator(this.heap[i], this.heap[j])
    }

    private swap(i: number, j: number) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]]
    }

    private siftUp() {
        let node = this.length - 1
        while (node > PriorityQueue.TOP && this.greater(node, PriorityQueue.parent(node))) {
            this.swap(node, PriorityQueue.parent(node))
            node = PriorityQueue.parent(node)
        }
    }

    private siftDown() {
        let node = PriorityQueue.TOP
        while (
            (PriorityQueue.left(node) < this.length && this.greater(PriorityQueue.left(node), node)) ||
            (PriorityQueue.right(node) < this.length && this.greater(PriorityQueue.right(node), node))
            ) {
            const maxChild = (PriorityQueue.right(node) < this.length && this.greater(PriorityQueue.right(node), PriorityQueue.left(node))) ? PriorityQueue.right(node) : PriorityQueue.left(node)
            this.swap(node, maxChild)
            node = maxChild
        }
    }

    private static parent(i: number) {
        return  ((i + 1) >>> 1) - 1
    }

    private static left(i: number) {
        return (i << 1) + 1
    }

    private static right(i: number) {
        return (i + 1) << 1
    }

    public [Symbol.iterator](): Iterator<T> {
        return {
            next: (): IteratorResult<T> => {
                return { done: this.heap.length === 0, value: this.pop()! }
            },
        }
    }
}

export function solve(input: string, multiplier = 1): number {
    const map = input.split('\n').map(s => s.split('').map(c => parseInt(c, 10)))

    // extend right
    for (let y = 0, h = map.length; y < h; y++) {
        const width = map[y].length
        for (let i = 1; i < multiplier; i++) {
            map[y] = [
                ...map[y],
                ...map[y].slice(0, width)
                    .map(n => n + i < 10 ? n + i : (n + i) % 9)]
        }
    }

    // extend down
    for (let i = 1, h = map.length; i < multiplier; i++) {
        for (let y = 0; y < h; y++) {
            map.push(map[y].map(n => n + i < 10 ? n + i : (n + i) % 9))
        }
    }

    const height = map.length
    const width  = map[0].length
    const start = `${0},${0}`
    const end = [width - 1, height - 1].join(',')
    const graph: Record<string, Record<string, number>> = {}

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const vertex = `${x},${y}`
            const neighbours = []
            if ( y > 0 )           neighbours.push([x, y - 1])
            if ( x < width - 1 )   neighbours.push([x + 1, y])
            if ( y < height - 1 )  neighbours.push([x, y + 1])
            if ( x > 0 )           neighbours.push([x - 1, y])
            graph[vertex] = {}
            neighbours.forEach(([x2, y2]) => graph[vertex][`${x2},${y2}`] = map[y2][x2])
        }
    }

    const risk: Record<string, number> = {}
    Object.keys(graph).forEach(xy => risk[xy] = Number.MAX_VALUE)
    risk[start] = 0

    const queue = new PriorityQueue<[string, number]>((a, b) => a[1] < b[1])
    queue.push([start, risk[start]])

    const visited = new Set()

    for (const [xy] of queue) {
        if (visited.has(xy)) {
            continue
        }

        visited.add(xy)

        for (const neighbour in graph[xy]) {
            if (risk[xy] + graph[xy][neighbour] < risk[neighbour]) {
                risk[neighbour] = risk[xy] + graph[xy][neighbour]
                queue.push([neighbour, risk[neighbour]])
            }
        }
    }

    return risk[end]
}

//region internal
export const partOne = (input: string) => solve(input)
export const partTwo = (input: string) => solve(input, 5)

// print solution to terminal if invoked directly
if (require.main === module) {
    const input = readFileSync(__dirname + '/input.txt').toString()
    console.log(partOne(input))
    console.log(partTwo(input))
}
//endregion