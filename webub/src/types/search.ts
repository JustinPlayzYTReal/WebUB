export interface SearchResult {
  title: string
  link: string
  displayLink: string
  snippet: string
  favicon?: string
  displayPath?: string
}

export interface SearchResponse {
  results: SearchResult[]
  totalResults: string
  searchTime: number
  query: string
}

export type SearchTab = 'all' | 'images' | 'news' | 'videos' | 'maps'
