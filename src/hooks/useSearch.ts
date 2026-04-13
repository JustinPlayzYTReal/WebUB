import { useEffect, useState } from 'react'
import { getDomainsCsvStream } from '../services/getDomainsCsvStream'
import { searchDomainsFromStream } from '../services/domainSearchService'
import { searchWeb } from '../services/webSearchService'
import { searchVideos } from '../services/videoService'
import { searchNews } from '../services/newsService'
import { searchMaps } from '../services/mapsService'
import type { SearchResponse, SearchResultItem, UseSearchOptions, Location } from '../types/search'

const PAGE_SIZE = 10

function serializeLocation(loc: Location | null | undefined): string {
  if (!loc) return 'none'
  const parts = []
  if (loc.city) parts.push(`city:${loc.city.toLowerCase()}`)
  if (loc.lat && loc.lng) parts.push(`geo:${loc.lat.toFixed(2)}:${loc.lng.toFixed(2)}`)
  return parts.join('-') || 'unknown'
}

function filterDomainsByLocation(results: SearchResultItem[], loc: Location | null): SearchResultItem[] {
  if (!loc?.country && !loc?.city) return results

  const lowerQuery = (loc.country || loc.city || '').toLowerCase()
  return results.filter(r => 
    r.displayedUrl.toLowerCase().includes(lowerQuery) ||
    r.url.toLowerCase().endsWith(`.${lowerQuery}`) ||
    r.displayedUrl.toLowerCase().endsWith(`.${lowerQuery}`)
  )
}

function cacheKey(query: string, tbm: string | null, loc: Location | null): string {
  return `webub:${tbm || 'all'}:search:${encodeURIComponent(query)}:${serializeLocation(loc)}`
}

interface CachedPayload {
  results: SearchResultItem[]
  totalResultsText: string
  timeSeconds: number
  truncated: boolean
}

export function useSearch(query: string, options: UseSearchOptions & { tbm?: string | null; location?: Location | null } = {}) {
  const start = options.start ?? 0
  const enabled = options.enabled ?? true
  const tbm = options.tbm ?? null
  const location = options.location ?? null
  const normalized = query.trim()

  const [data, setData] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled || !normalized) {
      setData(null)
      setLoading(false)
      setError(null)
      return
    }

    const key = cacheKey(normalized, tbm, location)
    const cachedRaw = sessionStorage.getItem(key)
    if (cachedRaw) {
      try {
        const cached = JSON.parse(cachedRaw) as CachedPayload
        setData({
          results: cached.results.slice(start, start + PAGE_SIZE),
          totalResultsText: cached.totalResultsText,
          timeSeconds: cached.timeSeconds,
          hasNextPage: start + PAGE_SIZE < cached.results.length,
          location,
        })
        setError(null)
        setLoading(false)
        return
      } catch {
        sessionStorage.removeItem(key)
      }
    }

    let cancelled = false
    const ac = new AbortController()
    setLoading(true)
    setError(null)
    setData(null)

    ;(async () => {
      try {
        const t0 = performance.now()
        const domainPromise = searchDomainsFromStream(normalized, () => getDomainsCsvStream(ac.signal), {
          signal: ac.signal,
          maxMatches: 50, // smaller for speed
        })
        const webPromise = searchWeb(normalized, { signal: ac.signal, location })

        let allResults: SearchResultItem[] = []

        // Await all
        const [domainsFull, webFull] = await Promise.all([domainPromise, webPromise])

        // Tag types
        const domains = filterDomainsByLocation(domainsFull.results, location).slice(0, 8).map(r => ({ ...r, type: 'domain' as const }))
        const webs = webFull.results.slice(0, 8).map(r => ({ ...r, type: 'web' as const }))

        if (tbm === null || tbm === 'all') {
          allResults = [...domains, ...webs]
        } else if (tbm === 'vid') {
          const videoFull = await searchVideos(normalized, { signal: ac.signal })
          const videos = videoFull.results.map(r => ({ ...r, type: 'video' as const }))
          allResults = videos
        } else if (tbm === 'nws') {
          const newsFull = await searchNews(normalized, { signal: ac.signal })
          const news = newsFull.results.map(r => ({ ...r, type: 'news' as const }))
          allResults = news
        } else if (tbm === 'map') {
          const mapsFull = await searchMaps(normalized, { signal: ac.signal, location })
          const maps = mapsFull.results.map(r => ({ ...r, type: 'maps' as const }))
          allResults = maps
          if (mapsFull.location) {
            setData(prev => prev ? { ...prev, location: mapsFull.location } : { ...data!, location: mapsFull.location })
          }
        } else { // images placeholder or other
          allResults = domains
        }

        const timeSeconds = (performance.now() - t0) / 1000

        const payload: CachedPayload = {
          results: allResults,
          totalResultsText: allResults.length.toString(),
          timeSeconds,
          truncated: false,
        }

        sessionStorage.setItem(key, JSON.stringify(payload))

        if (cancelled) return

        setData({
          results: allResults.slice(start, start + PAGE_SIZE),
          totalResultsText: payload.totalResultsText,
          timeSeconds,
          hasNextPage: start + PAGE_SIZE < allResults.length,
          location: location || undefined,
        })
      } catch (e: unknown) {
        if (cancelled) return
        if (e instanceof DOMException && e.name === 'AbortError') return
        setError(e instanceof Error ? e.message : 'Search failed')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
      ac.abort()
    }
  }, [normalized, start, enabled, tbm, location])

  const active = enabled && Boolean(normalized)

  return {
    data: active ? data : null,
    loading: active && loading,
    error: active ? error : null,
  }
}
