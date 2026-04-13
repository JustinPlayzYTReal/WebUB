import type { SearchResultItem, Location } from '../types/search'

interface DuckDuckGoResponse {
  Abstract?: string
  AbstractURL?: string
  Results?: Array<{ FirstURL: string; Text: string; Icon?: { URL: string } }>
}

export async function searchWeb(query: string, options?: { signal?: AbortSignal; location?: Location }): Promise<{ results: SearchResultItem[]; totalResultsText: string; timeSeconds: number }> {
  const t0 = performance.now()
  const params = new URLSearchParams({
    q: query.trim(),
    format: 'json',
    'no_html': '1',
    'skip_disambig': '1',
    'no_redirect': '1',
  })

  const url = `https://api.duckduckgo.com/?${params}`

  const controller = new AbortController()
  if (options?.signal) {
    options.signal.addEventListener('abort', () => controller.abort())
  }

  const res = await fetch(url, { signal: controller.signal })
  if (!res.ok) {
    throw new Error(`DDG API failed: ${res.status}`)
  }

  const data = await res.json() as DuckDuckGoResponse

  const results: SearchResultItem[] = []

  // Main abstract as top result
  if (data.Abstract && data.AbstractURL) {
    const absUrl = data.AbstractURL
    results.push({
      id: 'ddg-abstract',
      type: 'web',
      title: 'Overview',
      url: absUrl,
      displayedUrl: new URL(absUrl).hostname,
      snippet: data.Abstract.slice(0, 200) + '...',
    })
  }

  // Add results
  data.Results?.slice(0, 10).forEach(r => {
    if (r.FirstURL && r.Text) {
      const urlObj = new URL(r.FirstURL)
      results.push({
        id: `ddg-${urlObj.host}`,
        type: 'web',
        title: r.Text.split(' - ')[0] || r.FirstURL,
        url: r.FirstURL,
        displayedUrl: urlObj.host,
        snippet: r.Text,
        thumbnailUrl: r.Icon?.URL,
      })
    }
  })

  const timeSeconds = (performance.now() - t0) / 1000
  const totalResultsText = results.length.toString()

  return { results, totalResultsText, timeSeconds }
}
