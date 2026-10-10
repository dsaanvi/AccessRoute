
const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY

export async function searchLocation(query, signal) {
  if (!query.trim() || query.trim().length < 3) {
    return []
  }

  if (!API_KEY) {
    throw new Error('Geoapify API key is missing')
  }

  const url = new URL(
    'https://api.geoapify.com/v1/geocode/autocomplete'
  )

  url.searchParams.set('text', query.trim())
  url.searchParams.set('filter', 'countrycode:au')
  url.searchParams.set('limit', '5')
  url.searchParams.set('format', 'json')
  url.searchParams.set('apiKey', API_KEY)

  const response = await fetch(url.toString(), {
    signal,
  })

  if (!response.ok) {
    throw new Error(`Location search failed: ${response.status}`)
  }

  const data = await response.json()

  return (data.results || []).map((place) => ({
    name: place.formatted,
    latitude: Number(place.lat),
    longitude: Number(place.lon),
  }))
}
