import type { SearchResponse, SearchResultItem } from '../types/search'
import { SearchResult } from './SearchResult'

function SkeletonBlock() {
  return (
    <div className="max-w-2xl animate-pulse border-b border-white/10 py-4">
      <div className="mb-2 h-3 w-2/3 rounded bg-white/10" />
      <div className="mb-2 h-5 w-full max-w-md rounded bg-white/15" />
      <div className="h-3 w-full rounded bg-white/10" />
      <div className="mt-1 h-3 w-5/6 rounded bg-white/10" />
    </div>
  )
}

interface ResultsListProps {
  loading: boolean
  data: SearchResponse | null
  error: string | null
  query: string
}

function groupByType(results: SearchResponse['results']) {
  const groups: Record<string, SearchResultItem[]> = {}
  results.forEach(r => {
    const key = r.type || 'other'
    if (!groups[key]) groups[key] = []
    groups[key].push(r)
  })
  return groups
}

export function ResultsList({ loading, data, error, query }: ResultsListProps) {
  if (loading) {
    return (
      <div className="pl-0 lg:pl-36" aria-busy="true" aria-label="Loading results">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonBlock key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="pl-0 text-red-300 lg:pl-36">
        <p className="font-medium">Something went wrong</p>
        <p className="mt-1 text-sm text-white/70">{error}</p>
      </div>
    )
  }

  if (!query.trim()) {
    return null
  }

  const results = data?.results ?? []
  if (results.length === 0) {
    return (
      <div className="pl-0 text-white/60 lg:pl-36">
        <p>No results found for "{query}".</p>
      </div>
    )
  }

  const groups = groupByType(results)

  return (
    <div className="pl-0 lg:pl-36">
      {Object.entries(groups).flatMap(([type, groupResults]) => [
        groupResults.length > 0 && (
          <div key={`group-${type}`} className="mb-6">
            <h3 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-white/60 first:mt-0">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </h3>
            <div className="space-y-4">
              {groupResults.map((r) => (
                <SearchResult key={r.id} result={r} />
              ))}
            </div>
          </div>
        ),
      ])}
    </div>
  )
}
