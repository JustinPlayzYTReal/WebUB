export interface WikipediaRelatedTopic {
  title: string
  url: string
}

export interface WikipediaCard {
  title: string
  extract: string
  articleUrl: string
  thumbnailUrl?: string
  /** “People also search for”–style links from Wikipedia search */
  relatedTopics?: WikipediaRelatedTopic[]
}
