import dns from 'node:dns/promises'
import net from 'node:net'

const MAX_BYTES = 2 * 1024 * 1024 // 2 MB
const TIMEOUT_MS = 8000
const MAX_REDIRECTS = 3

class UserError extends Error {}

function isPrivateIp(ip) {
    if (net.isIPv4(ip)) {
        const [a, b] = ip.split('.').map(Number)
        return (
            a === 0 || a === 10 || a === 127 ||
            (a === 100 && b >= 64 && b <= 127) ||
            (a === 169 && b === 254) ||
            (a === 172 && b >= 16 && b <= 31) ||
            (a === 192 && b === 168)
        )
    }
    if (net.isIPv6(ip)) {
        const v = ip.toLowerCase()
        return (
            v === '::1' || v === '::' ||
            v.startsWith('fc') || v.startsWith('fd') ||
            v.startsWith('fe80') || v.startsWith('::ffff:')
        )
    }
    return true
}

async function assertSafeUrl(urlString) {
    let url
    try {
        url = new URL(urlString)
    } catch {
        throw new UserError('That does not look like a valid URL.')
    }

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        throw new UserError('Only http and https URLs are allowed.')
    }
    if (url.port && url.port !== '80' && url.port !== '443') {
        throw new UserError('Custom ports are not allowed.')
    }

    const host = url.hostname.replace(/^\[|\]$/g, '')
    const addresses = net.isIP(host)
        ? [{ address: host }]
        : await dns.lookup(host, { all: true }).catch(() => {
              throw new UserError('Could not find that website.')
          })

    if (addresses.some((a) => isPrivateIp(a.address))) {
        throw new UserError('That address is not allowed.')
    }
    return url
}

async function readLimited(response) {
    const reader = response.body.getReader()
    const chunks = []
    let total = 0

    while (true) {
        const { done, value } = await reader.read()
        if (done) break
        total += value.length
        if (total > MAX_BYTES) {
            await reader.cancel()
            throw new UserError('That page is too large to scan (limit 2 MB).')
        }
        chunks.push(value)
    }
    return Buffer.concat(chunks).toString('utf-8')
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST requests allowed' })
    }

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

    try {
        let current = req.body?.url
        if (!current || typeof current !== 'string') {
            throw new UserError('Please provide a URL.')
        }

        let response
        for (let i = 0; i <= MAX_REDIRECTS; i++) {
            const safeUrl = await assertSafeUrl(current)
            current = safeUrl.href

            response = await fetch(current, {
                redirect: 'manual', // we check every redirect ourselves
                signal: controller.signal,
                headers: {
                    'User-Agent': 'AccessiScan/1.0 (accessibility checker)',
                    Accept: 'text/html,application/xhtml+xml',
                },
            })

            const isRedirect = response.status >= 300 && response.status < 400
            const location = response.headers.get('location')
            if (isRedirect && location) {
                current = new URL(location, current).href
                if (i === MAX_REDIRECTS) throw new UserError('Too many redirects.')
                continue
            }
            break
        }

        if (!response.ok) {
            throw new UserError(`The website replied with status ${response.status}.`)
        }

        const type = response.headers.get('content-type') || ''
        if (!type.includes('text/html') && !type.includes('application/xhtml')) {
            throw new UserError('That URL is not an HTML page.')
        }

        const html = await readLimited(response)
        return res.status(200).json({ html, finalUrl: current })
    } catch (error) {
        if (error instanceof UserError) {
            return res.status(400).json({ error: error.message })
        }
        if (error.name === 'AbortError') {
            return res.status(504).json({ error: 'The website took too long to respond.' })
        }
        console.error('fetch-html failed:', error.message)
        return res.status(500).json({ error: 'Could not fetch that page.' })
    } finally {
        clearTimeout(timer)
    }
}