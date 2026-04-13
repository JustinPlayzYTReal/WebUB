import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  onPageChange: (page: number) => void
  hasMore: boolean
}

const COLORS = ['text-[#4285f4]', 'text-[#ea4335]', 'text-[#fbbc04]', 'text-[#4285f4]', 'text-[#34a853]', 'text-[#ea4335]']
const LOGO_LETTERS = ['G', 'o', 'o', 'g', 'l', 'e']

export function Pagination({ currentPage, onPageChange, hasMore }: PaginationProps) {
  const pages = Array.from({ length: 10 }, (_, i) => i + 1)

  return (
    <div className="flex flex-col items-center py-8 gap-2">
      {/* Google-style colored logo above pagination */}
      <div className="flex items-baseline mb-2 select-none">
        {LOGO_LETTERS.map((letter, i) => (
          <span key={i} className={`text-[32px] font-bold leading-none ${COLORS[i]}`}>
            {letter}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-1">
        {currentPage > 1 && (
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className="flex items-center gap-1 px-4 py-2 text-[#1a73e8] text-sm hover:underline"
          >
            <ChevronLeft size={16} />
            Previous
          </button>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              w-9 h-9 rounded text-sm font-['Roboto',_Arial,_sans-serif] transition-colors
              ${page === currentPage
                ? 'bg-[#1a73e8] text-white cursor-default'
                : 'text-[#1a73e8] hover:bg-[#f1f3f4]'}
            `}
          >
            {page}
          </button>
        ))}

        {hasMore && (
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="flex items-center gap-1 px-4 py-2 text-[#1a73e8] text-sm hover:underline"
          >
            Next
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
