import type { WikipediaCard, WikipediaRelatedTopic } from '../types/wikipedia'

interface RestSummaryJson {
  type?: string
  title?: string
  extract?: string
  thumbnail?: { source?: string }
  content_urls?: { desktop?: { page?: string } }
}

function isNotFoundPayload(data: unknown): boolean {
  if (!data || typeof data !== 'object') return true
  const t = (data as RestSummaryJson).type
  if (typeof t !== 'string') return false
  return t.includes('not_found') || t.includes('NotFound')
}

function toCard(data: RestSummaryJson): WikipediaCard | null {
  const title = data.title?.trim()
  const url = data.content_urls?.desktop?.page
  if (!title || !url) return null

  let extract = (data.extract ?? '').trim()
  if (!extract && data.type === 'disambiguation') {
    extract =
      'Wikipedia has several articles for this term. Use the link below to choose a topic.'
  }
  if (!extract) return null

  return {
    title,
    extract,
    articleUrl: url,
    thumbnailUrl: data.thumbnail?.source,
  }
}

async function fetchRestSummary(titleOrQuery: string): Promise<RestSummaryJson | null> {
  const enc = encodeURIComponent(titleOrQuery.trim().replace(/\s+/g, '_'))
  const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${enc}`)
  if (!res.ok) return null
  const data = (await res.json()) as RestSummaryJson
  if (isNotFoundPayload(data)) return null
  return data
}

/** MediaWiki REST: best title matches for the query (works well for “food”, “paris”, etc.) */
async function searchTitleRest(query: string): Promise<string | null> {
  const url = `https://en.wikipedia.org/w/rest.php/v1/search/title?q=${encodeURIComponent(query)}&limit=5`
  const res = await fetch(url)
  if (!res.ok) return null
  const data = (await res.json()) as {
    pages?: { title: string }[] | Record<string, { title: string }>
  }
  const raw = data.pages
  if (!raw) return null
  const list = Array.isArray(raw) ? raw : Object.values(raw)
  return list[0]?.title ?? null
}

/** Classic opensearch (completions) */
async function openSearchFirstTitle(query: string): Promise<string | null> {
  const url =
    `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}` +
    '&limit=5&namespace=0&format=json&origin=*'
  const res = await fetch(url)
  if (!res.ok) return null
  const json = (await res.json()) as [string, string[], string[], string[]]
  return json[1]?.[0] ?? null
}

/** Full-text search on Wikipedia when title lookup misses */
async function queryListSearch(query: string): Promise<string | null> {
  const url =
    `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}` +
    '&srlimit=1&format=json&origin=*'
  const res = await fetch(url)
  if (!res.ok) return null
  const data = (await res.json()) as { query?: { search?: { title: string }[] } }
  return data.query?.search?.[0]?.title ?? null
}

async function loadSummaryByTitleCandidates(query: string): Promise<RestSummaryJson | null> {
  const q = query.trim()

  let data = await fetchRestSummary(q)
  if (data && !isNotFoundPayload(data)) return data

  const strategies = [
    () => searchTitleRest(q),
    () => openSearchFirstTitle(q),
    () => queryListSearch(q),
  ]

  for (const getTitle of strategies) {
    const title = await getTitle()
    if (!title) continue
    data = await fetchRestSummary(title)
    if (data && !isNotFoundPayload(data)) return data
  }

  return null
}

function wikiArticleUrl(title: string): string {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/\s+/g, '_'))}`
}

async function fetchRelatedTopics(
  mainTitle: string,
  query: string,
): Promise<WikipediaRelatedTopic[]> {
  const url =
    `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}` +
    '&limit=12&namespace=0&format=json&origin=*'
  const res = await fetch(url)
  if (!res.ok) return []
  const json = (await res.json()) as [string, string[], string[], string[]]
  const titles = json[1] ?? []
  const main = mainTitle.toLowerCase()

  const seen = new Set<string>()
  const out: WikipediaRelatedTopic[] = []
  for (const t of titles) {
    const lower = t.toLowerCase()
    if (lower === main || seen.has(lower)) continue
    seen.add(lower)
    out.push({ title: t, url: wikiArticleUrl(t) })
    if (out.length >= 6) break
  }
  return out
}

/**
 * English Wikipedia summary: definitions and encyclopedic descriptions for topics like “food”, people, places.
 * Uses several lookup strategies + related topics (similar to Google’s knowledge panel).
 */
export async function fetchWikipediaCard(query: string): Promise<WikipediaCard | null> {
  const q = query.trim()
  if (q.length < 2) return null

  const summary = await loadSummaryByTitleCandidates(q)
  if (!summary) return null

  const card = toCard(summary)
  if (!card) return null

  card.relatedTopics = await fetchRelatedTopics(card.title, q)
  return card
}
