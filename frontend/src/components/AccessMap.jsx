import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from 'react-leaflet'

import 'leaflet/dist/leaflet.css'

function AccessMap() {

    const startPosition = [-37.8136, 144.9631]

    const destinationPosition = [-37.8004, 144.9584]

    return (
        <div className="map-container">

            <div className="map-header">
                <div>
                    <p className="small-label">ROUTE PREVIEW</p>
                    <h3>Your journey</h3>
                </div>

                <span className="map-status">
                    Map preview
                </span>
            </div>

            <MapContainer
                center={startPosition}
                zoom={13}
                className="access-map"
            >

                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={startPosition}>
                    <Popup>
                        Starting point
                    </Popup>
                </Marker>

                <Marker position={destinationPosition}>
                    <Popup>
                        Destination
                    </Popup>
                </Marker>

            </MapContainer>

        </div>
    )
}

export default AccessMap