# WebUB Search Enhancements TODO

## Plan Steps (Approved)

1. **[DONE]** Update `src/types/search.ts`: Add `Location` type (lat/lng/city), `type: 'domain'|'web'|'video'|'news'` to `SearchResultItem`.

2. **[DONE]** Create new services:
   - `src/services/webSearchService.ts` (DuckDuckGo API for web/articles).
   - `src/services/videoService.ts` (YouTube API placeholder).
   - `src/services/newsService.ts` (NewsAPI placeholder).
   - `src/services/mapsService.ts` (Nominatim/OSM).

3. **[DONE]** Update `src/components/SearchBar.tsx`: Add location button (Geolocation + city fallback).

4. **[DONE]** Update `src/hooks/useSearch.ts`: Accept location/tbm, filter domains, combine web/video/news/maps results.

5. **[DONE]** Update `src/pages/SearchPage.tsx`: Location state, tabs use services (all=mixed, videos/news/maps active), UI polish.

6. **[DONE]** Update `src/components/ResultsList.tsx` & `SearchResult.tsx`: Thumbnails, type icons/badges, grouping.

7. **[PENDING]** Maps tab: Add `src/services/mapsService.ts` + Leaflet integration in SearchPage.

8. **[PENDING]** Test: Run `npm run dev`, verify location+web sources for people/places/things.

9. **[PENDING]** Polish UI, handle API keys/errors.

**Next Action**: Complete step 1 (types), confirm before proceeding.

Updated after each step.
