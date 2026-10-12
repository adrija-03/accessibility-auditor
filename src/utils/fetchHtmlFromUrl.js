export async function fetchHtmlFromUrl(rawUrl) {
    let url = rawUrl.trim()
    if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(url)) url = `https://${url}`

    const response = await fetch('/api/fetch-html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
        throw new Error(data.error || 'Could not fetch that page.')
    }
    return data
}