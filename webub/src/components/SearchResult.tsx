import type { SearchResult } from '../types/search'

interface SearchResultProps {
  result: SearchResult
}

export function SearchResultItem({ result }: SearchResultProps) {
  const urlParts = result.displayPath?.split('/') ?? [result.displayLink]

  return (
    <div className="mb-7 max-w-[600px]">
      {/* URL Row */}
      <div className="flex items-center gap-2 mb-0.5">
        {result.favicon ? (
          <img
            src={result.favicon}
            alt=""
            width={16}
            height={16}
            className="rounded-full w-4 h-4"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        ) : (
          <div className="w-4 h-4 rounded-full bg-[#f1f3f4] flex items-center justify-center text-[9px] font-bold text-[#5f6368]">
            {result.displayLink[0].toUpperCase()}
          </div>
        )}
        <div className="text-sm text-[#202124] leading-snug truncate">
          <span>{result.displayLink}</span>
          {urlParts.length > 1 && (
            <span className="text-[#70757a]">
              {' › '}
              {urlParts.slice(1).filter(Boolean).join(' › ')}
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <a
        href={result.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-xl text-[#1a0dab] leading-snug hover:underline font-normal mb-1 visited:text-[#609]"
      >
        {result.title}
      </a>

      {/* Snippet */}
      <p
        className="text-sm text-[#4d5156] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: result.snippet }}
      />
    </div>
  )
}
