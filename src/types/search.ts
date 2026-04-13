export interface Location {
  city?: string
  country?: string
  lat?: number
  lng?: number
}

export interface SearchResultItem {
  id: string
  type?: 'domain' | 'web' | 'video' | 'news' | 'image' | 'maps'
  title: string
  url: string
  displayedUrl: string
  snippet: string
  thumbnailUrl?: string  // for images/videos
}

export interface SearchResponse {
  location?: Location | null
  results: SearchResultItem[]
  totalResultsText: string
  timeSeconds: number
  hasNextPage: boolean
}

export interface UseSearchOptions {
  start?: number
  location?: Location | null
  enabled?: boolean
}

export type SearchMode = 'web' | 'images' | 'videos' | 'news' | 'maps'
