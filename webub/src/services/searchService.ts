import axios from 'axios'
import type { SearchResponse, SearchResult } from '../types/search'

const SERPAPI_KEY = import.meta.env.VITE_SERPAPI_KEY
const BRAVE_API_KEY = import.meta.env.VITE_BRAVE_API_KEY
const PROVIDER = import.meta.env.VITE_SEARCH_PROVIDER || 'serpapi'

// ─── SerpAPI ────────────────────────────────────────────────────────────────

async function searchViaSerpApi(query: string, page = 1): Promise<SearchResponse> {
  const start = (page - 1) * 10
  const { data } = await axios.get('https://serpapi.com/search', {
    params: {
      q: query,
      api_key: SERPAPI_KEY,
      engine: 'google',
      start,
      num: 10,
    },
  })

  const results: SearchResult[] = (data.organic_results ?? []).map((r: Record<string, string>) => ({
    title: r.title,
    link: r.link,
    displayLink: r.displayed_link ?? new URL(r.link).hostname,
    snippet: r.snippet ?? '',
    displayPath: r.displayed_link ?? r.link,
    favicon: `https://www.google.com/s2/favicons?domain=${new URL(r.link).hostname}&sz=32`,
  }))

  return {
    results,
    totalResults: data.search_information?.total_results ?? '0',
    searchTime: data.search_information?.time_taken_displayed ?? 0,
    query,
  }
}

// ─── Brave Search API ────────────────────────────────────────────────────────

async function searchViaBrave(query: string, page = 1): Promise<SearchResponse> {
  const offset = (page - 1) * 10
  const start = performance.now()

  const { data } = await axios.get('https://api.search.brave.com/res/v1/web/search', {
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip',
      'X-Subscription-Token': BRAVE_API_KEY,
    },
    params: { q: query, count: 10, offset },
  })

  const elapsed = (performance.now() - start) / 1000

  const results: SearchResult[] = (data.web?.results ?? []).map((r: Record<string, string>) => ({
    title: r.title,
    link: r.url,
    displayLink: new URL(r.url).hostname,
    snippet: r.description ?? '',
    displayPath: r.url,
    favicon: `https://www.google.com/s2/favicons?domain=${new URL(r.url).hostname}&sz=32`,
  }))

  return {
    results,
    totalResults: String(data.web?.totalCount ?? results.length),
    searchTime: parseFloat(elapsed.toFixed(2)),
    query,
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function search(query: string, page = 1): Promise<SearchResponse> {
  if (PROVIDER === 'brave') {
    return searchViaBrave(query, page)
  }
  return searchViaSerpApi(query, page)
}
