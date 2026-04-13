import type { SearchResult } from '../types/search'
import { SearchResultItem } from './SearchResult'

interface ResultsListProps {
  results: SearchResult[]
  loading: boolean
  error: string | null
}

function Skeleton() {
  return (
    <div className="mb-7 max-w-[600px] animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-48 mb-2" />
      <div className="h-6 bg-gray-200 rounded w-96 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-full mb-1" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
    </div>
  )
}

export function ResultsList({ results, loading, error }: ResultsListProps) {
  if (loading) {
    return (
      <div>
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} />)}
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-[600px] py-8 text-center">
        <p className="text-[#202124] text-lg mb-2">Something went wrong.</p>
        <p className="text-[#70757a] text-sm">{error}</p>
        <p className="text-[#70757a] text-sm mt-2">
          Make sure your API key is set in <code className="bg-gray-100 px-1 rounded">.env</code>
        </p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="max-w-[600px] py-8">
        <p className="text-[#202124] text-lg mb-2">Your search did not match any documents.</p>
        <p className="text-[#70757a] text-sm">Suggestions:</p>
        <ul className="text-[#70757a] text-sm list-disc list-inside mt-1 space-y-1">
          <li>Make sure all words are spelled correctly.</li>
          <li>Try different keywords.</li>
          <li>Try more general keywords.</li>
        </ul>
      </div>
    )
  }

  return (
    <div>
      {results.map((result, i) => (
        <SearchResultItem key={`${result.link}-${i}`} result={result} />
      ))}
    </div>
  )
}
