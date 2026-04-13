import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { KnowledgePanel } from '../components/KnowledgePanel'
import { ResultsList } from '../components/ResultsList'
import { useSearch } from '../hooks/useSearch'
import { useWikipediaSummary } from '../hooks/useWikipediaSummary'
import type { Location } from '../types/search'

const TABS = [
  { id: 'all' as const, label: 'All', tbm: null },
  { id: 'images' as const, label: 'Images', tbm: 'isch' },
  { id: 'news' as const, label: 'News', tbm: 'nws' },
  { id: 'videos' as const, label: 'Videos', tbm: 'vid' },
  { id: 'maps' as const, label: 'Maps', tbm: 'map' },
]

function buildSearchPath(query: string, tbm: string | null): string {
  const q = query.trim()
  const base = `/search?q=${encodeURIComponent(q)}`
  if (!tbm) return base
  return `${base}&tbm=${encodeURIComponent(tbm)}`
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const tbm = searchParams.get('tbm') || null
  const [input, setInput] = useState(q)
  const [start, setStart] = useState(0)
  const [location, setLocation] = useState<Location | null>(null)

  const isAllTab = !tbm
  const tab = TABS.find(t => t.tbm === tbm) || TABS[0]

  const { data, loading, error } = useSearch(q, {
    start,
    tbm,
    location,
    enabled: true, // All tabs now supported
  })

  const wiki = useWikipediaSummary(q, isAllTab)

  useEffect(() => {
    const trimmed = q.trim()
    if (trimmed) {
      const display = trimmed.length > 60 ? `${trimmed.slice(0, 57)}...` : trimmed
      document.title = `${display} - WebUB Search`
    } else {
      document.title = 'WebUB Search'
    }
    return () => {
      document.title = 'WebUB'
    }
  }, [q])

  function submitSearch() {
    const next = input.trim()
    if (!next) return
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('q', next)
    if (tbm) nextParams.set('tbm', tbm)
    // Note: location not in URL, session state
    setSearchParams(nextParams, { replace: true })
  }

  const queryForLinks = q.trim() || input.trim()
  const showKnowledge = wiki.loading || wiki.card
  const tabLabel = tab.label.toLowerCase()

  const gridClass = showKnowledge 
    ? 'flex flex-col gap-10 xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(300px,400px)] xl:items-start xl:gap-12'
    : 'flex flex-col'

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Header
        variant="search"
        searchValue={input}
        location={location}
        onSearchChange={setInput}
        onSearchSubmit={submitSearch}
        onLocationChange={setLocation}
      />

      <div className="border-b border-white/15 px-4 lg:px-10">
        <nav className="-mb-px flex gap-6 overflow-x-auto text-sm lg:ml-36" aria-label="Search categories">
          {TABS.map(({ id, label, tbm: tabTbm }) => {
            const href = buildSearchPath(queryForLinks, tabTbm)
            const isActive = tabTbm === tbm || (tabTbm === null && isAllTab)
            return (
              <Link
                key={id}
                to={href}
                className={
                  isActive
                    ? 'border-b-2 border-white py-3 font-medium text-white outline-none ring-white/30 focus-visible:ring-2'
                    : 'border-b-2 border-transparent py-3 text-white/50 outline-none ring-white/30 transition hover:text-white focus-visible:ring-2'
                }
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="flex flex-1 flex-col px-4 py-6 lg:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className={gridClass}>
            {showKnowledge && (
              <aside className="order-1 w-full min-w-0 xl:sticky xl:top-4 xl:order-2">
                <KnowledgePanel loading={wiki.loading} card={wiki.card} />
              </aside>
            )}

            <div className="order-2 min-w-0 xl:order-1">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/45 lg:pl-36">
                {isAllTab ? 'Web results' : `${tabLabel} results`}
              </h2>
              <p className="mb-4 max-w-2xl text-xs text-white/50 lg:pl-36">
                {isAllTab ? 'Domains, articles, videos from your location.' : `${tabLabel.charAt(0).toUpperCase() + tabLabel.slice(1)} search results.`}
              </p>

              {loading && q.trim() && (
                <p className="mb-4 pl-0 text-sm text-white/55 lg:pl-36">Searching…</p>
              )}
              {!loading && data && q.trim() && (
                <p className="mb-4 pl-0 text-sm text-white/65 lg:pl-36">
                  About {data.totalResultsText} results ({data.timeSeconds.toFixed(2)}s)
                  {location && (
                    <>
                      {' '}·{' '}
                      <span className="text-white/70">
                        {location.city ? `near ${location.city}` : `${location.lat?.toFixed(1)}, ${location.lng?.toFixed(1)}`}
                      </span>
                    </>
                  )}
                </p>
              )}

              <ResultsList loading={loading} data={data} error={error} query={q} />

              {!loading && data?.hasNextPage && !error && q.trim() && (
                <div className="mt-8 pl-0 lg:pl-36">
                  <button
                    type="button"
                    onClick={() => setStart((s) => s + 10)}
                    className="rounded-full border border-white/30 bg-transparent px-5 py-2 text-sm font-medium text-white outline-none ring-white/25 transition hover:border-white hover:bg-white hover:text-black focus-visible:ring-2"
                  >
                    More results
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
