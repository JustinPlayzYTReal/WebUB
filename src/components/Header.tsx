import { Link } from 'react-router-dom'
import { SearchBar } from './SearchBar'

type HeaderVariant = 'home' | 'search'

import type { Location } from '../types/search'

interface HeaderProps {
  variant: HeaderVariant
  searchValue?: string
  location?: Location | null
  onSearchChange?: (value: string) => void
  onLocationChange?: (loc: Location | null) => void
  onSearchSubmit?: () => void
}

export function Header({
  variant,
  searchValue = '',
  onSearchChange,
  onSearchSubmit,
}: HeaderProps) {
  if (variant === 'home') {
    return (
      <header className="flex items-center justify-end gap-4 border-b border-white/15 px-4 py-3 sm:px-6">
        <nav className="flex items-center gap-4 text-sm sm:gap-6">
          <a
            href="#"
            className="text-white/80 outline-none ring-white/30 transition hover:text-white focus-visible:ring-2"
            onClick={(e) => e.preventDefault()}
          >
            Gmail
          </a>
          <a
            href="#"
            className="text-white/80 outline-none ring-white/30 transition hover:text-white focus-visible:ring-2"
            onClick={(e) => e.preventDefault()}
          >
            Images
          </a>
          <a
            href="#"
            className="rounded-full border border-white/40 bg-transparent px-4 py-1.5 font-medium text-white outline-none ring-white/30 transition hover:border-white hover:bg-white hover:text-black focus-visible:ring-2"
            onClick={(e) => e.preventDefault()}
          >
            Sign In
          </a>
        </nav>
      </header>
    )
  }

  return (
    <header className="border-b border-white/15 px-4 py-3 lg:px-10">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-8">
        <div className="flex min-w-0 items-center gap-4 lg:gap-8">
          <Link
            to="/"
            className="shrink-0 text-xl font-bold tracking-tight text-white sm:text-2xl"
            aria-label="WebUB Home"
          >
            <span className="text-white">Web</span>
            <span className="text-white/85">UB</span>
          </Link>
          {onSearchChange && onSearchSubmit && (
            <div className="min-w-0 flex-1 lg:max-w-2xl">
              <SearchBar
                value={searchValue}
                location={location}
                onChange={onSearchChange}
                onLocationChange={onLocationChange}
                onSearch={onSearchSubmit}
                compact
              />
            </div>
          )}
        </div>
        <nav className="flex shrink-0 items-center justify-end gap-3 text-sm sm:gap-5 lg:ml-auto">
          <a
            href="#"
            className="text-white/80 outline-none ring-white/30 transition hover:text-white focus-visible:ring-2"
            onClick={(e) => e.preventDefault()}
          >
            Gmail
          </a>
          <a
            href="#"
            className="text-white/80 outline-none ring-white/30 transition hover:text-white focus-visible:ring-2"
            onClick={(e) => e.preventDefault()}
          >
            Images
          </a>
          <a
            href="#"
            className="rounded-full border border-white/40 bg-transparent px-3 py-1.5 text-sm font-medium text-white outline-none ring-white/30 transition hover:border-white hover:bg-white hover:text-black focus-visible:ring-2 sm:px-4"
            onClick={(e) => e.preventDefault()}
          >
            Sign In
          </a>
        </nav>
      </div>
    </header>
  )
}
