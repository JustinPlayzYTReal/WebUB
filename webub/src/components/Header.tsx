import { Link, useNavigate } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { Logo } from './Logo'
import { SearchBar } from './SearchBar'
import { useDarkMode } from '../hooks/useDarkMode'
import type { SearchTab } from '../types/search'

interface HeaderProps {
  query: string
  activeTab: SearchTab
  onTabChange: (tab: SearchTab) => void
}

const TABS: { id: SearchTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'images', label: 'Images' },
  { id: 'news', label: 'News' },
  { id: 'videos', label: 'Videos' },
  { id: 'maps', label: 'Maps' },
]

export function Header({ query, activeTab, onTabChange }: HeaderProps) {
  const navigate = useNavigate()
  const { isDark, toggle } = useDarkMode()

  const handleSearch = (q: string) => {
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-[#202124] border-b border-[#ebebeb] dark:border-[#3c4043]">
      {/* Top row */}
      <div className="flex items-center gap-4 px-6 py-2">
        <Link to="/" className="flex-shrink-0">
          <Logo size="sm" />
        </Link>

        <div className="flex-1 max-w-[584px]">
          <SearchBar
            initialValue={query}
            onSearch={handleSearch}
            size="results"
            autoFocus={false}
          />
        </div>

        <button
          onClick={toggle}
          className="ml-auto p-2 rounded-full text-[#70757a] hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043] transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Tab row */}
      <nav className="flex pl-[168px] overflow-x-auto scrollbar-none">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              px-4 py-3 text-[13px] whitespace-nowrap border-b-[3px] transition-colors
              ${activeTab === tab.id
                ? 'text-[#1a73e8] border-[#1a73e8] font-medium'
                : 'text-[#70757a] border-transparent hover:text-[#202124] dark:hover:text-white'}
            `}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
