import { Search, MapPin, Globe } from 'lucide-react'
import type { FormEvent, KeyboardEvent, MouseEvent } from 'react'
import type { Location } from '../types/search'

interface SearchBarProps {
  value: string
  location?: Location | null
  onChange: (value: string) => void
  onSearch: () => void
  onLocationChange?: (loc: Location | null) => void
  placeholder?: string
  autoFocus?: boolean
  compact?: boolean
  className?: string
}

export function SearchBar({
  value,
  location,
  onChange,
  onSearch,
  onLocationChange,
  placeholder = 'Search the web',
  autoFocus,
  compact = false,
  className = '',
}: SearchBarProps) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSearch()
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSearch()
    }
  }

  async function handleLocationClick(e: MouseEvent) {
    e.preventDefault()
    if (!onLocationChange) return

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLoc: Location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          onLocationChange(newLoc)
        },
        (error) => {
          console.error('Geolocation failed:', error)
          // Fallback: prompt for city
          const city = prompt('Geolocation unavailable. Enter city:')
          if (city) {
            onLocationChange({ city })
          }
        },
        { timeout: 10000 }
      )
    } else {
      const city = prompt('Enter city for local results:')
      if (city) {
        onLocationChange({ city })
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative w-full ${className}`}
      role="search"
    >
      <div
        className={
          compact
            ? 'flex h-11 items-center rounded-full border border-white/25 bg-black pl-4 pr-2 outline-none ring-white/20 transition focus-within:border-white/50 focus-within:ring-2'
            : 'flex h-12 items-center rounded-full border border-white/25 bg-black pl-5 pr-3 outline-none ring-white/20 transition focus-within:border-white/50 focus-within:ring-2 sm:h-14 sm:pl-6'
        }
      >
        <Search
          className="mr-3 h-5 w-5 shrink-0 text-white/50"
          aria-hidden
        />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/40"
          aria-label="Search"
        />
        {location && (
          <button
            type="button"
            title="Location active"
            className="mr-1 h-6 w-6 rounded-full bg-white/10 p-0.5 text-white/70 outline-none ring-white/30 hover:bg-white/20 focus-visible:ring-2"
          >
            <Globe className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={handleLocationClick}
          title={location ? 'Change location' : 'Use my location'}
          className="h-6 w-6 rounded-full bg-white/10 p-0.5 text-white/70 outline-none ring-white/30 transition hover:bg-white/20 focus-visible:ring-2"
          aria-label="Location"
        >
          <MapPin className="h-4 w-4" />
        </button>
      </div>
      {location && (
        <p className="mt-2 flex items-center gap-2 text-xs text-white/50">
          <Globe className="h-3 w-3" />
          {location.city ? `Searching near ${location.city}` : `Lat ${location.lat?.toFixed(4)}, Lng ${location.lng?.toFixed(4)}`}
        </p>
      )}
    </form>
  )
}
