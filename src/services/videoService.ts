import type { SearchResultItem } from '../types/search'

// Placeholder: Replace YOUR_YOUTUBE_API_KEY with https://console.developers.google.com/apis/credentials
const YOUTUBE_API_KEY = 'YOUR_YOUTUBE_API_KEY' // Get free quota key

export async function searchVideos(query: string, options?: { maxResults?: number; signal?: AbortSignal }): Promise<{ results: SearchResultItem[]; totalResultsText: string; timeSeconds: number }> {
  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY') {
    return {
      results: [{
        id: 'placeholder-video',
        type: 'video',
        title: 'YouTube Search (Add API key to src/services/videoService.ts)',
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
        displayedUrl: 'youtube.com',
        snippet: 'Get free YouTube Data API v3 key for video results.',
      }],
      totalResultsText: '1+',
      timeSeconds: 0.1,
    }
  }

  const t0 = performance.now()
  const params = new URLSearchParams({
    part: 'snippet',
    q: query.trim(),
    type: 'video',
    maxResults: (options?.maxResults ?? 8).toString(),
    key: YOUTUBE_API_KEY,
  })

  const controller = new AbortController()
  options?.signal?.addEventListener('abort', () => controller.abort())

  const url = `https://www.googleapis.com/youtube/v3/search?${params}`
  const res = await fetch(url, { signal: controller.signal })
  if (!res.ok) throw new Error(`YouTube API error: ${res.statusText}`)

  const data = await res.json()
  const items = data.items ?? []

  const results: SearchResultItem[] = items.map((item: any, i: number) => ({
    id: `yt-${item.id.videoId}`,
    type: 'video',
    title: item.snippet.title,
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    displayedUrl: 'youtube.com',
    snippet: item.snippet.description.slice(0, 160) + '...',
    thumbnailUrl: item.snippet.thumbnails.medium.url,
  }))

  const timeSeconds = (performance.now() - t0) / 1000

  return {
    results,
    totalResultsText: data.pageInfo?.totalResults?.toLocaleString() ?? results.length.toString(),
    timeSeconds,
  }
}
