
const API_KEY = import.meta.env.VITE_ORS_API_KEY

export async function calculateRoute(
  startCoordinates,
  destinationCoordinates,
  selectedPreferences = [],
  signal
) {
  if (!API_KEY) {
    throw new Error('Openrouteservice API key is missing.')
  }

  const start = [
    startCoordinates[1],
    startCoordinates[0],
  ]

  const destination = [
    destinationCoordinates[1],
    destinationCoordinates[0],
  ]

  const needsAccessibleRoute =
    selectedPreferences.includes('step-free') ||
    selectedPreferences.includes('stairs')

  const profile = needsAccessibleRoute
    ? 'wheelchair'
    : 'foot-walking'

  const response = await fetch(
    `https://api.openrouteservice.org/v2/directions/${profile}/geojson`,
    {
      method: 'POST',
      headers: {
        Authorization: API_KEY,
        'Content-Type': 'application/json',
        Accept: 'application/geo+json',
      },
      body: JSON.stringify({
        coordinates: [start, destination],
      }),
      signal,
    }
  )

  if (!response.ok) {
    let details = ''

    try {
      const errorData = await response.json()
      details =
        errorData.error?.message ||
        errorData.message ||
        ''
    } catch {
      // Use the HTTP status if no JSON error is available.
    }

    throw new Error(
      details ||
      `Routing request failed (${response.status}).`
    )
  }

  const data = await response.json()
  const feature = data.features?.[0]

  if (!feature?.geometry?.coordinates?.length) {
    throw new Error('No route was found for these locations.')
  }

  const coordinates = feature.geometry.coordinates.map(
    ([longitude, latitude]) => [latitude, longitude]
  )

  const summary = feature.properties?.summary

  return {
    coordinates,
    distanceKm: (summary?.distance || 0) / 1000,
    durationMinutes: (summary?.duration || 0) / 60,
    profile,
  }
}
