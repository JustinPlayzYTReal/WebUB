import type { SearchResultItem, Location } from '../types/search'

// Nominatim (OpenStreetMap) - free, no key, rate limit respectful
export async function searchMaps(query: string, options?: { location?: Location; signal?: AbortSignal }): Promise<{ results: SearchResultItem[]; location?: Location; totalResultsText: string; timeSeconds: number }> {
  const t0 = performance.now()

  const params = new URLSearchParams({
    q: query.trim(),
    format: 'json',
    limit: '10',
    'accept-language': 'en',
  })

  // Bias to location if provided
  if (options?.location?.lat && options?.location?.lng) {
    params.set('viewbox', `${options.location.lng - 0.1},${options.location.lat - 0.1},${options.location.lng + 0.1},${options.location.lat + 0.1}`)
    params.set('bounded', '1')
  }

  const controller = new AbortController()
  options?.signal?.addEventListener('abort', () => controller.abort())

  const url = `https://nominatim.openstreetmap.org/search?${params}`
  const res = await fetch(url, {
    signal: controller.signal,
    headers: { 'User-Agent': 'WebUB/1.0 (contact for issues)' }, // Required for Nominatim
  })
  if (!res.ok) throw new Error('Nominatim API failed')

  const places = await res.json() as Array<{ place_id: string; display_name: string; lat: string; lon: string; type: string }>

  const results: SearchResultItem[] = places.map(place => ({
    id: `map-${place.place_id}`,
    type: 'maps',
    title: place.display_name.split(',')[0],
    url: `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=16/${place.lat}/${place.lon}`,
    displayedUrl: 'openstreetmap.org',
    snippet: `Type: ${place.type} - ${place.display_name}`,
  }))

  const timeSeconds = (performance.now() - t0) / 1000
  return {
    results,
    location: places[0] ? { lat: parseFloat(places[0].lat), lng: parseFloat(places[0].lon), city: places[0].display_name.split(',')[0] } : undefined,
    totalResultsText: places.length.toString(),
    timeSeconds,
  }
}
