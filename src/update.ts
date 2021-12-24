import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { get } from 'https'
import { join } from 'path'

const [nowYear, nowMonth, nowDay] = new Date().toLocaleString('en-GB', { timeZone: 'America/New_York' })
    .replace(/,.+/, '')
    .split('/')
    .map(s => parseInt(s.replace(/^0/, ''), 10))
    .reverse()

const minYear = 2015
const maxYear = nowMonth < 12 ? nowYear - 1 : nowYear
const maxDay = nowMonth < 12 ? 25 : nowDay
const year = maxYear

if (year < minYear || maxYear < year) {
    console.error(`year must be between ${minYear} and ${maxYear}`)
    process.exit(1)
}

console.info(`updating tasks for year ${year} ..`)
const cacheDir = join(__dirname, '../cache')
if ( ! existsSync(cacheDir)) mkdirSync(cacheDir)

const sessionId = process.env.SESSION_ID

async function main(): Promise<void> {
    for (let day = 1; day <= maxDay; day++) {
        const dayFormatted = `0${day}`.slice(-2)
        const outDir = join(__dirname, dayFormatted)
        if ( ! existsSync(outDir)) {
            console.error(`skipping day ${day}: src not found`)
            continue
        }
        //region download task
        const cacheFile = join(cacheDir, `${year}-${dayFormatted}.html`)
        if ( ! existsSync(cacheFile)) {
            console.info(`updating task for day ${day} ..`)
            if ( ! sessionId) {
                console.error('env.SESSION_ID is not set')
                process.exit(1)
            }
            const url = `https://adventofcode.com/${year}/day/${day}`
            const response = await new Promise<string>((resolve, reject) => {
                const req = get(url, { headers: { cookie: `session=${sessionId}` } }, (res) => {
                    const buffer: string[] = []
                    res.on('data', data => buffer.push(data.toString()))
                    res.on('end', () => {
                        const data = buffer.join('')
                        if (res.statusCode !== 200) return reject(data)
                        else resolve(data)
                    })
                })

                req.on('error', reject)
            })
            writeFileSync(cacheFile, response)
            await new Promise<string>(resolve => setTimeout(resolve, 2000))
        }
        //endregion
        //region download input
        const inputFile = join(outDir, 'input.txt')
        if ( ! existsSync(inputFile)) {
            console.info(`updating input for day ${day} ..`)
            if ( ! sessionId) {
                console.error('env.SESSION_ID is not set')
                process.exit(1)
            }
            const url = `https://adventofcode.com/${year}/day/${day}/input`
            const response = await new Promise<string>((resolve, reject) => {
                const req = get(url, { headers: { cookie: `session=${sessionId}` } }, (res) => {
                    const buffer: string[] = []
                    res.on('data', data => buffer.push(data.toString()))
                    res.on('end', () => {
                        const data = buffer.join('')
                        if (res.statusCode !== 200) return reject(data)
                        else resolve(data)
                    })
                })

                req.on('error', reject)
            })
            writeFileSync(inputFile, response.replace(/\n$/, ''))
        }
        //endregion
        //region convert markdown
        const html = readFileSync(cacheFile).toString('utf-8')
        const articles = html.match(/<article.+?<\/article>/gs)
        if ( ! articles) {
            console.error(`failed to detect parts for ${year} day ${day}`)
            continue
        }
        if (articles.length < 2) {
            console.warn(`only found one part for ${year} day ${day}`)
        }
        const articleToMarkdown = (html: string): string => {
            return html.replace(/<a [^>]*\bhref="([^"]+)"[^>]*>(.+?)<\/a>/gs, '[$2]($1)')
                .replace(/(<[^> ]+) [^>]*/g, '$1')
                .replace(/<\/?article>/g, '')
                .replace(/<h2>(.+?)<\/h2>/gs, '### $1\n\n')
                .replace(/<p>(.+?)<\/p>/gs, '$1\n')
                .replace(/<span>(.+?)<\/span>/gs, '$1')
                .replace(/<pre><code>(.+?)<\/code><\/pre>/gs, '<pre>\n$1</pre>\n')
                .replace(/<code><em>(.+?)<\/em><\/code>/gs, '<b><code>$1</code></b>')
                .replace(/<em>(.+?)<\/em>/gs, '<b>$1</b>')
                .replace(/<ul>(.+?)<\/ul>/gs, '$1').replace(/<ul>(.+?)<\/ul>/gs, '$1')
                .replace(/<li>(.+?)<\/li>/gs, '- $1').replace(/<li>(.+?)<\/li>/gs, '- $1')
                .replace(/ {2,}([A-Z])/g, ' $1')
                .replace(/\n{3,}/g, '\n\n')
                .trim()
        }
        const markdown = articles.map(articleToMarkdown).join('\n\n')
        const buffer: string[] = []
        const targetLineLength = 100
        for (let line of markdown.split('\n')) {
            if (line.length === 0) buffer.push('')
            let padding = ''
            if (line.match(/^ *-/)) {
                const length = 2 + (line.match(/^ +/)?.[0].length ?? 0)
                padding = new Array(length).fill(' ').join('')
            }
            while (line.length > targetLineLength) {
                let i = targetLineLength
                while (line[i] !== ' ' && i > 0) i--
                if (i === 0) {
                    i = targetLineLength
                    while (line[i] !== ' ' && i < line.length) i++
                }
                const substr = line.slice(0, i)
                buffer.push(substr)
                line = padding + line.slice(i).replace(/^ /, '')
            }
            if (line.length > 0) buffer.push(line)
        }
        const formatted = buffer.join('\n')
        const outFile = join(outDir, 'README.md')
        writeFileSync(outFile, formatted)
        //endregion
    }
}

void main()