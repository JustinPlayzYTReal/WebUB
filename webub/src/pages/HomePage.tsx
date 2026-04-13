import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { SearchBar } from '../components/SearchBar'
import { Footer } from '../components/Footer'
import { useDarkMode } from '../hooks/useDarkMode'
import { Moon, Sun } from 'lucide-react'

export function HomePage() {
  const navigate = useNavigate()
  const { isDark, toggle } = useDarkMode()

  useEffect(() => {
    document.title = 'WebUB'
  }, [])

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  const handleLucky = (query: string) => {
    if (!query.trim()) return
    navigate(`/search?q=${encodeURIComponent(query)}&lucky=1`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#202124] text-[#202124] dark:text-white">
      {/* Top-right nav */}
      <div className="flex justify-end items-center px-6 py-3 gap-4">
        <a href="#" className="text-sm text-[#202124] dark:text-[#e8eaed] hover:underline">Gmail</a>
        <a href="#" className="text-sm text-[#202124] dark:text-[#e8eaed] hover:underline">Images</a>
        <button
          onClick={toggle}
          className="p-2 rounded-full text-[#70757a] hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043] transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="px-5 py-2 bg-[#1a73e8] text-white text-sm rounded font-medium hover:bg-[#1557b0] transition-colors">
          Sign in
        </button>
      </div>

      {/* Center content */}
      <main className="flex flex-col items-center justify-center flex-1 -mt-16 px-4">
        <Logo size="lg" className="mb-8" />

        <SearchBar onSearch={handleSearch} size="home" autoFocus />

        <div className="flex gap-3 mt-7">
          <button
            onClick={() => {
              const input = document.querySelector<HTMLInputElement>('input[type="text"]')
              if (input) handleSearch(input.value)
            }}
            className="px-4 h-9 bg-[#f8f9fa] dark:bg-[#303134] border border-[#f8f9fa] dark:border-[#303134] rounded text-[14px] text-[#3c4043] dark:text-[#e8eaed] font-['Roboto',_Arial,_sans-serif] hover:border-[#dadce0] dark:hover:border-[#5f6368] hover:shadow-sm transition-all"
          >
            WebUB Search
          </button>
          <button
            onClick={() => {
              const input = document.querySelector<HTMLInputElement>('input[type="text"]')
              if (input) handleLucky(input.value)
            }}
            className="px-4 h-9 bg-[#f8f9fa] dark:bg-[#303134] border border-[#f8f9fa] dark:border-[#303134] rounded text-[14px] text-[#3c4043] dark:text-[#e8eaed] font-['Roboto',_Arial,_sans-serif] hover:border-[#dadce0] dark:hover:border-[#5f6368] hover:shadow-sm transition-all"
          >
            I'm Feeling Lucky
          </button>
        </div>

        <p className="mt-8 text-[13px] text-[#70757a]">
          WebUB offered in:{' '}
          <a href="#" className="text-[#1a0dab] dark:text-[#8ab4f8] hover:underline">Español</a>
          {' · '}
          <a href="#" className="text-[#1a0dab] dark:text-[#8ab4f8] hover:underline">Français</a>
          {' · '}
          <a href="#" className="text-[#1a0dab] dark:text-[#8ab4f8] hover:underline">Deutsch</a>
        </p>
      </main>

      <Footer variant="home" />
    </div>
  )
}
