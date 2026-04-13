import { ExternalLink, Youtube, MapPin, Newspaper } from 'lucide-react'
import type { SearchResultItem } from '../types/search'
import type { SearchResultItem } from '../types/search'

interface TypeIconProps {
  type: SearchResultItem['type']
}

function TypeIcon({ type }: TypeIconProps) {
  switch (type) {
    case 'video':
      return <Youtube className="h-3.5 w-3.5 text-red-500" aria-hidden />
    case 'maps':
      return <MapPin className="h-3.5 w-3.5 text-blue-400" aria-hidden />
    case 'news':
      return <Newspaper className="h-3.5 w-3.5 text-orange-500" aria-hidden />
    case 'image':
      return <img src="/public/images.svg" alt="" className="h-4 w-4" />
    default:
      return null
  }
}

interface SearchResultProps {
  result: SearchResultItem
  isThumbnail?: boolean
}

export function SearchResult({ result, isThumbnail = false }: SearchResultProps) {
  const showThumbnail = result.thumbnailUrl && !isThumbnail

  return (
    <article className={`group ${isThumbnail ? 'aspect-video rounded-lg' : 'max-w-2xl border-b border-white/10 py-4 last:border-b-0'}`}>
      {showThumbnail && (
        <a href={result.url} target="_blank" rel="noopener noreferrer" className="block">
          <img
            src={result.thumbnailUrl}
            alt=""
            className="h-24 w-32 flex-none rounded object-cover shadow-md group-hover:opacity-90 lg:h-28 lg:w-40"
            loading="lazy"
          />
        </a>
      )}
      <div className="flex flex-col">
        {result.type && !isThumbnail && (
          <span className="mb-1 flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-white/50">
            {result.type} <TypeIcon type={result.type} />
          </span>
        )}
        {!isThumbnail && (
          <p className="mb-1 truncate text-xs text-white/50">{result.displayedUrl}</p>
        )}
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${
            isThumbnail 
              ? 'line-clamp-2 text-sm font-bold leading-tight text-white hover:underline' 
              : 'text-xl font-medium leading-snug text-white outline-none ring-white/30 transition hover:underline focus-visible:ring-2 visited:text-white/80'
          }`}
        >
          {result.title}
        </a>
        <p className={`mt-1 leading-relaxed text-white/60 ${isThumbnail ? 'text-xs line-clamp-2' : 'text-sm'}`}>
          {result.snippet}
        </p>
        {!isThumbnail && (
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 self-start text-sm font-medium text-white/80 outline-none ring-white/30 transition hover:underline focus-visible:ring-2"
          >
            Visit <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        )}
      </div>
    </article>
  )
}
