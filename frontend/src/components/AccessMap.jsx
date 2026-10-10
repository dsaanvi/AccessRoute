
import { useEffect } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Default map location: Melbourne
const MELBOURNE = [-37.8136, 144.9631]

// Custom starting point marker
const startIcon = L.divIcon({
  className: 'custom-map-marker',
  html: `
    <div style="
      background:#86e7b1;
      width:22px;
      height:22px;
      border:4px solid #173127;
      border-radius:50%;
      box-shadow:0 0 0 3px rgba(134,231,177,.25);
    "></div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
})

// Custom destination marker
const destinationIcon = L.divIcon({
  className: 'custom-map-marker',
  html: `
    <div style="
      background:#ffffff;
      width:22px;
      height:22px;
      border:4px solid #173127;
      border-radius:50%;
      box-shadow:0 0 0 3px rgba(255,255,255,.2);
    "></div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
})

// Automatically adjust map view
function MapViewController({
  startCoordinates,
  destinationCoordinates,
}) {
  const map = useMap()

  useEffect(() => {
    if (startCoordinates && destinationCoordinates) {
      // Show both selected locations
      const bounds = L.latLngBounds([
        startCoordinates,
        destinationCoordinates,
      ])

      map.fitBounds(bounds, {
        padding: [45, 45],
        maxZoom: 15,
        animate: true,
      })
    } else if (startCoordinates) {
      // Show starting point
      map.flyTo(startCoordinates, 15, {
        duration: 1,
      })
    } else if (destinationCoordinates) {
      // Show destination
      map.flyTo(destinationCoordinates, 15, {
        duration: 1,
      })
    } else {
      // Return to Melbourne when no locations are selected
      map.flyTo(MELBOURNE, 12, {
        duration: 1,
      })
    }
  }, [startCoordinates, destinationCoordinates, map])

  return null
}

function AccessMap({
  startCoordinates,
  destinationCoordinates,
  startName,
  destinationName,
}) {
  return (
    <MapContainer
      center={MELBOURNE}
      zoom={12}
      scrollWheelZoom={false}
      style={{
        height: '100%',
        width: '100%',
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapViewController
        startCoordinates={startCoordinates}
        destinationCoordinates={destinationCoordinates}
      />

      {startCoordinates && (
        <Marker
          position={startCoordinates}
          icon={startIcon}
        >
          <Popup>
            <strong>Starting point</strong>
            <p>{startName || 'Selected starting point'}</p>
          </Popup>
        </Marker>
      )}

      {destinationCoordinates && (
        <Marker
          position={destinationCoordinates}
          icon={destinationIcon}
        >
          <Popup>
            <strong>Destination</strong>
            <p>{destinationName || 'Selected destination'}</p>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  )
}

export default AccessMap
