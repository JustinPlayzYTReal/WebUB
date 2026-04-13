import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { SearchBar } from '../components/SearchBar'
import { getDomainsCsvStream } from '../services/getDomainsCsvStream'
import { getLuckyUrlFromStream } from '../services/domainSearchService'

export function HomePage() {
  const navigate = useNavigate()
  const [value, setValue] = useState('')

  function runSearch() {
    const q = value.trim()
    if (!q) return
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  async function feelingLucky() {
    const q = value.trim()
    if (!q) return
    const ac = new AbortController()
    try {
      const url = await getLuckyUrlFromStream(q, () => getDomainsCsvStream(ac.signal), {
        signal: ac.signal,
      })
      if (url) {
        window.location.assign(url)
      } else {
        navigate(`/search?q=${encodeURIComponent(q)}`)
      }
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === 'AbortError') return
      navigate(`/search?q=${encodeURIComponent(q)}`)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Header variant="home" />
      <main className="flex flex-1 flex-col items-center px-4 pb-16 pt-8 sm:pt-16 md:pt-24">
        <h1 className="mb-8 text-center text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl md:mb-10">
          <span className="text-white">Web</span>
          <span className="text-white/85">UB</span>
        </h1>

        <p className="mb-6 max-w-xl text-center text-sm text-white/60">
          Search for a topic (e.g. <strong className="text-white/90">food</strong>, a city, or a person) to
          see a <strong className="text-white/90">Wikipedia summary</strong>—what it is and key facts—plus
          domain matches from{' '}
          <code className="rounded border border-white/20 bg-black px-1.5 py-0.5 text-white/90">
            Domains.csv
          </code>
          .
        </p>

        <div className="w-full max-w-xl">
          <SearchBar
            value={value}
            onChange={setValue}
            onSearch={runSearch}
            autoFocus
          />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={runSearch}
            className="rounded-full border border-white/30 bg-transparent px-5 py-2 text-sm font-medium text-white outline-none ring-white/25 transition hover:border-white hover:bg-white hover:text-black focus-visible:ring-2"
          >
            WebUB Search
          </button>
          <button
            type="button"
            onClick={() => void feelingLucky()}
            className="rounded-full border border-white/30 bg-transparent px-5 py-2 text-sm font-medium text-white outline-none ring-white/25 transition hover:border-white hover:bg-white hover:text-black focus-visible:ring-2"
          >
            I&apos;m Feeling Lucky
          </button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
