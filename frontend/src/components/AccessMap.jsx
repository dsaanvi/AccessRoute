
import { useEffect } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const MELBOURNE = [-37.8136, 144.9631]

function createMarker(color) {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        width: 22px;
        height: 22px;
        background: ${color};
        border: 4px solid #173127;
        border-radius: 50%;
        box-shadow: 0 0 0 3px rgba(134,231,177,0.25);
        box-sizing: border-box;
      "></div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  })
}

const startIcon = createMarker('#86e7b1')
const destinationIcon = createMarker('#ffffff')

function MapViewController({
  startCoordinates,
  destinationCoordinates,
  route,
}) {
  const map = useMap()

  useEffect(() => {
    if (route?.coordinates?.length > 1) {
      map.fitBounds(L.latLngBounds(route.coordinates), {
        padding: [35, 35],
        maxZoom: 16,
      })
    } else if (startCoordinates && destinationCoordinates) {
      map.fitBounds(
        L.latLngBounds([
          startCoordinates,
          destinationCoordinates,
        ]),
        {
          padding: [35, 35],
          maxZoom: 15,
        }
      )
    } else if (startCoordinates || destinationCoordinates) {
      map.flyTo(
        startCoordinates || destinationCoordinates,
        15,
        { duration: 1 }
      )
    } else {
      map.flyTo(MELBOURNE, 12, { duration: 1 })
    }
  }, [map, startCoordinates, destinationCoordinates, route])

  return null
}

function AccessMap({
  startCoordinates,
  destinationCoordinates,
  startName,
  destinationName,
  route,
}) {
  return (
    <MapContainer
      center={MELBOURNE}
      zoom={12}
      scrollWheelZoom={false}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapViewController
        startCoordinates={startCoordinates}
        destinationCoordinates={destinationCoordinates}
        route={route}
      />

      {route?.coordinates?.length > 1 && (
        <>
          <Polyline
            positions={route.coordinates}
            pathOptions={{
              color: '#173127',
              weight: 10,
              opacity: 0.8,
            }}
          />
          <Polyline
            positions={route.coordinates}
            pathOptions={{
              color: '#86e7b1',
              weight: 5,
              opacity: 1,
            }}
          />
        </>
      )}

      {startCoordinates && (
        <Marker position={startCoordinates} icon={startIcon}>
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
