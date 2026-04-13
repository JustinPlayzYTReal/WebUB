import { ExternalLink } from 'lucide-react'
import type { WikipediaCard } from '../types/wikipedia'

function KnowledgeSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/20 bg-black p-6">
      <div className="mb-4 aspect-[16/9] w-full rounded-lg border border-white/10 bg-white/10" />
      <div className="mb-3 h-9 w-3/4 rounded bg-white/15" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-white/10" />
        <div className="h-3 w-full rounded bg-white/10" />
        <div className="h-3 w-4/5 rounded bg-white/10" />
      </div>
      <div className="mt-6 h-4 w-40 rounded bg-white/10" />
    </div>
  )
}

interface KnowledgePanelProps {
  loading: boolean
  card: WikipediaCard | null
}

export function KnowledgePanel({ loading, card }: KnowledgePanelProps) {
  if (loading) {
    return <KnowledgeSkeleton />
  }

  if (!card) {
    return null
  }

  return (
    <article className="rounded-2xl border border-white/20 bg-black p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
      {card.thumbnailUrl && (
        <div className="mb-5 overflow-hidden rounded-xl border border-white/15">
          <img
            src={card.thumbnailUrl}
            alt=""
            className="max-h-56 w-full object-cover object-center"
            loading="lazy"
          />
        </div>
      )}

      <h2 className="text-3xl font-normal leading-tight tracking-tight text-white md:text-4xl">
        {card.title}
      </h2>

      <p className="mt-4 text-base leading-relaxed text-white/75">{card.extract}</p>

      <p className="mt-5 text-sm text-white/50">
        Source:{' '}
        <a
          href={card.articleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/90 underline decoration-white/30 underline-offset-2 outline-none ring-white/30 transition hover:decoration-white focus-visible:ring-2"
        >
          Wikipedia
        </a>
      </p>

      <a
        href={card.articleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-white outline-none ring-white/30 transition hover:underline focus-visible:ring-2"
      >
        Full article
        <ExternalLink className="h-3.5 w-3.5" aria-hidden />
      </a>

      {card.relatedTopics && card.relatedTopics.length > 0 && (
        <div className="mt-8 border-t border-white/15 pt-6">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/45">
            People also search for
          </h3>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {card.relatedTopics.map((topic) => (
              <li key={topic.title}>
                <a
                  href={topic.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2.5 text-center text-xs font-medium leading-snug text-white/85 outline-none ring-white/20 transition hover:border-white/35 hover:bg-white/[0.06] focus-visible:ring-2"
                >
                  {topic.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}
