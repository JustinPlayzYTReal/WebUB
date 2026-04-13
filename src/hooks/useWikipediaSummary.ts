import { useEffect, useState } from 'react'
import { fetchWikipediaCard } from '../services/wikipediaService'
import type { WikipediaCard } from '../types/wikipedia'

export function useWikipediaSummary(query: string, enabled: boolean) {
  const [loading, setLoading] = useState(false)
  const [card, setCard] = useState<WikipediaCard | null>(null)

  useEffect(() => {
    if (!enabled || !query.trim()) {
      setCard(null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setCard(null)

    void fetchWikipediaCard(query.trim())
      .then((c) => {
        if (!cancelled) setCard(c)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [query, enabled])

  return { loading, card }
}
