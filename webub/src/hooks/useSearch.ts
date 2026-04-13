import { useState, useEffect, useCallback } from 'react'
import { search } from '../services/searchService'
import type { SearchResponse } from '../types/search'

const CACHE_PREFIX = 'webub_cache_'

function getCacheKey(query: string, page: number) {
  return `${CACHE_PREFIX}${query.toLowerCase().trim()}_p${page}`
}

interface UseSearchState {
  data: SearchResponse | null
  loading: boolean
  error: string | null
}

export function useSearch(query: string, page = 1) {
  const [state, setState] = useState<UseSearchState>({
    data: null,
    loading: false,
    error: null,
  })

  const fetchResults = useCallback(async () => {
    if (!query.trim()) return

    const cacheKey = getCacheKey(query, page)
    const cached = sessionStorage.getItem(cacheKey)

    if (cached) {
      setState({ data: JSON.parse(cached) as SearchResponse, loading: false, error: null })
      return
    }

    setState((s) => ({ ...s, loading: true, error: null }))

    try {
      const data = await search(query, page)
      sessionStorage.setItem(cacheKey, JSON.stringify(data))
      setState({ data, loading: false, error: null })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Search failed. Please try again.'
      setState({ data: null, loading: false, error: msg })
    }
  }, [query, page])

  useEffect(() => {
    void fetchResults()
  }, [fetchResults])

  return { ...state, refetch: fetchResults }
}
