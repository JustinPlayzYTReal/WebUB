import type { SearchResultItem } from '../types/search'

const DEFAULT_MAX_MATCHES = 400
const YIELD_EVERY_LINES = 12_000

export interface DomainSearchFullResult {
  /** All matching rows up to maxMatches */
  results: SearchResultItem[]
  totalResultsText: string
  timeSeconds: number
  /** True if more matches may exist beyond the cap */
  truncated: boolean
}

function parseDataLine(line: string): { rank: string; domain: string; opr: string } | null {
  const t = line.trim()
  if (!t || t.startsWith('"Rank"')) return null
  const m = t.match(/^"(\d+)","([^"]+)","([^"]*)"$/)
  if (!m) return null
  return { rank: m[1], domain: m[2], opr: m[3] }
}

async function* iterateLines(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (value) buffer += decoder.decode(value, { stream: !done })
      const parts = buffer.split(/\r?\n/)
      buffer = parts.pop() ?? ''
      for (const line of parts) yield line
      if (done) break
    }
  } finally {
    reader.releaseLock()
  }
  if (buffer.trim()) yield buffer
}

function makeResult(row: { rank: string; domain: string; opr: string }, index: number): SearchResultItem {
  const { rank, domain, opr } = row
  const url = domain.includes('://') ? domain : `https://${domain}`
  return {
    id: `${rank}-${domain}-${index}`,
    title: domain,
    url,
    displayedUrl: domain,
    snippet: `Open Page Rank ${opr} · Majestic Million rank #${rank}`,
  }
}

/**
 * Streams the CSV and collects domains whose hostname contains the query (case-insensitive).
 */
export async function searchDomainsFromStream(
  query: string,
  openStream: () => Promise<ReadableStream<Uint8Array>>,
  options?: {
    signal?: AbortSignal
    maxMatches?: number
  },
): Promise<DomainSearchFullResult> {
  const q = query.trim().toLowerCase()
  if (!q) {
    return {
      results: [],
      totalResultsText: '0',
      timeSeconds: 0,
      truncated: false,
    }
  }

  const maxMatches = options?.maxMatches ?? DEFAULT_MAX_MATCHES
  const t0 = performance.now()
  const stream = await openStream()
  const results: SearchResultItem[] = []
  let truncated = false
  let lineNum = 0

  for await (const line of iterateLines(stream)) {
    if (options?.signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError')
    }

    lineNum += 1
    if (lineNum % YIELD_EVERY_LINES === 0) {
      await new Promise((r) => setTimeout(r, 0))
    }

    const row = parseDataLine(line)
    if (!row) continue
    if (!row.domain.toLowerCase().includes(q)) continue

    results.push(makeResult(row, results.length))
    if (results.length >= maxMatches) {
      truncated = true
      break
    }
  }

  const elapsed = (performance.now() - t0) / 1000

  let totalResultsText: string
  if (results.length === 0) {
    totalResultsText = '0'
  } else if (truncated) {
    totalResultsText = `${maxMatches}+`
  } else {
    totalResultsText = String(results.length)
  }

  return {
    results,
    totalResultsText,
    timeSeconds: elapsed,
    truncated,
  }
}

export async function getLuckyUrlFromStream(
  query: string,
  openStream: () => Promise<ReadableStream<Uint8Array>>,
  options?: { signal?: AbortSignal },
): Promise<string | null> {
  const q = query.trim().toLowerCase()
  if (!q) return null

  const stream = await openStream()
  for await (const line of iterateLines(stream)) {
    if (options?.signal?.aborted) return null
    const row = parseDataLine(line)
    if (!row) continue
    if (!row.domain.toLowerCase().includes(q)) continue
    const d = row.domain
    return d.includes('://') ? d : `https://${d}`
  }
  return null
}
