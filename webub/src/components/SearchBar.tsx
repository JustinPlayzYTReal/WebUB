import { useState, useRef, type KeyboardEvent } from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  initialValue?: string
  onSearch: (query: string) => void
  size?: 'home' | 'results'
  autoFocus?: boolean
}

export function SearchBar({ initialValue = '', onSearch, size = 'home', autoFocus }: SearchBarProps) {
  const [value, setValue] = useState(initialValue)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = () => {
    if (value.trim()) onSearch(value.trim())
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch()
    if (e.key === 'Escape') {
      setValue('')
      inputRef.current?.blur()
    }
  }

  const isHome = size === 'home'

  return (
    <div
      className={`
        relative flex items-center bg-white border border-[#dfe1e5] rounded-full
        transition-shadow hover:shadow-[0_1px_6px_rgba(32,33,36,.28)] hover:border-transparent
        focus-within:shadow-[0_1px_6px_rgba(32,33,36,.28)] focus-within:border-transparent
        ${isHome ? 'w-[580px] max-w-[95vw] h-[44px]' : 'w-full h-[40px]'}
      `}
    >
      {isHome && (
        <Search className="absolute left-4 text-[#9aa0a6]" size={18} />
      )}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isHome ? '' : ''}
        autoFocus={autoFocus}
        className={`
          flex-1 bg-transparent outline-none font-['Roboto',_Arial,_sans-serif] text-[16px]
          text-[#202124] placeholder-[#9aa0a6]
          ${isHome ? 'pl-12 pr-10' : 'pl-4 pr-20'}
        `}
      />
      {value && (
        <button
          onClick={() => { setValue(''); inputRef.current?.focus() }}
          className="absolute right-12 text-[#70757a] hover:text-[#202124] transition-colors"
        >
          <X size={18} />
        </button>
      )}
      <button
        onClick={handleSearch}
        className={`
          absolute right-3 flex items-center justify-center rounded-full transition-colors
          ${isHome
            ? 'w-8 h-8 text-[#9aa0a6] hover:text-[#4285f4]'
            : 'w-8 h-8 text-[#4285f4] hover:bg-[#f1f3f4]'}
        `}
      >
        <Search size={20} />
      </button>
    </div>
  )
}
