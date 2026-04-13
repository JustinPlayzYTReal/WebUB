import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { ResultsList } from '../components/ResultsList'
import { Pagination } from '../components/Pagination'
import { Footer } from '../components/Footer'
import { useSearch } from '../hooks/useSearch'
import type { SearchTab } from '../types/search'

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('q') ?? ''
  const pageParam = parseInt(searchParams.get('page') ?? '1', 10)

  const [activeTab, setActiveTab] = useState<SearchTab>('all')
  const [page, setPage] = useState(pageParam)

  const { data, loading, error } = useSearch(query, page)

  useEffect(() => {
    if (query) {
      document.title = `${query} - WebUB Search`
    }
  }, [query])

  useEffect(() => {
    setPage(1)
  }, [query])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    navigate(`/search?${params.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!query) {
    navigate('/')
    return null
  }

  const formatResultCount = (raw: string) => {
    const num = parseInt(raw.replace(/,/g, ''), 10)
    if (isNaN(num)) return raw
    return `About ${num.toLocaleString()} results`
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#202124] text-[#202124] dark:text-white">
      <Header query={query} activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 pl-[168px] pr-6 pt-5 max-w-[900px] max-[768px]:pl-4">
        {/* Result count */}
        {data && !loading && (
          <p className="text-[#70757a] text-[13px] mb-5">
            {formatResultCount(data.totalResults)}
            {data.searchTime > 0 && ` (${data.searchTime} seconds)`}
          </p>
        )}

        {/* Images placeholder tab */}
        {activeTab === 'images' ? (
          <div className="max-w-[600px] py-12 text-center">
            <p className="text-[#202124] dark:text-[#e8eaed] text-lg mb-2">Image search coming soon.</p>
            <p className="text-[#70757a] text-sm">
              Add your image search API endpoint in <code className="bg-gray-100 dark:bg-[#303134] px-1 rounded">searchService.ts</code>
            </p>
          </div>
        ) : activeTab !== 'all' ? (
          <div className="max-w-[600px] py-12 text-center">
            <p className="text-[#202124] dark:text-[#e8eaed] text-lg mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} tab coming soon.
            </p>
          </div>
        ) : (
          <>
            <ResultsList
              results={data?.results ?? []}
              loading={loading}
              error={error}
            />

            {!loading && !error && (data?.results.length ?? 0) > 0 && (
              <Pagination
                currentPage={page}
                onPageChange={handlePageChange}
                hasMore={(data?.results.length ?? 0) >= 10}
              />
            )}
          </>
        )}
      </main>

      <Footer variant="results" />
    </div>
  )
}
