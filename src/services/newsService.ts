import type { SearchResultItem } from '../types/search'

// Placeholder: Replace with NewsAPI key from https://newsapi.org/ (free tier)
const NEWS_API_KEY = 'YOUR_NEWSAPI_KEY'

export async function searchNews(query: string, options?: { signal?: AbortSignal }): Promise<{ results: SearchResultItem[]; totalResultsText: string; timeSeconds: number }> {
  if (!NEWS_API_KEY || NEWS_API_KEY === 'YOUR_NEWSAPI_KEY') {
    return {
      results: [{
        id: 'placeholder-news',
        type: 'news',
        title: 'News Search (Add NewsAPI key)',
        url: `https://news.google.com/search?q=${encodeURIComponent(query)}`,
        displayedUrl: 'news.google.com',
        snippet: 'Sign up at newsapi.org for free key to enable news results.',
      }],
      totalResultsText: 'Coming soon',
      timeSeconds: 0.1,
    }
  }

  const t0 = performance.now()
  const params = new URLSearchParams({
    q: query.trim(),
    apiKey: NEWS_API_KEY,
    sortBy: 'publishedAt',
    pageSize: '8',
  })

  const controller = new AbortController()
  options?.signal?.addEventListener('abort', () => controller.abort())

  const url = `https://newsapi.org/v2/everything?${params}`
  const res = await fetch(url, { signal: controller.signal })
  if (!res.ok) throw new Error('NewsAPI failed')

  const data = await res.json()
  const articles = data.articles ?? []

  const results: SearchResultItem[] = articles.map((article: any) => ({
    id: `news-${article.url}`,
    type: 'news',
    title: article.title,
    url: article.url,
    displayedUrl: new URL(article.url).hostname,
    snippet: article.description?.slice(0, 160) ?? '',
    thumbnailUrl: article.urlToImage,
  }))

  const timeSeconds = (performance.now() - t0) / 1000

  return {
    results,
    totalResultsText: data.totalResults?.toString() ?? results.length.toString(),
    timeSeconds,
  }
}
