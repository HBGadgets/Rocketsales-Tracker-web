import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './LiveMap.css' // Import the CSS file
import { useLocation, useNavigate } from 'react-router-dom'
import L from 'leaflet'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

const DEFAULT_POSITION = [17.3850, 78.4867]

const LiveMap = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { salesman } = location.state || {}

  const coordinates = salesman?.location?.coordinates 
  ? [
      salesman.location.coordinates[1], 
      salesman.location.coordinates[0]
    ] 
  : DEFAULT_POSITION

  const handleBackToDashboard = () => navigate('/dashboard')

  return (
    <div className="live-map-container">
      <div className="header-container" style={{marginTop:'-14px', marginBottom:'3px'}}>
        <h4>{salesman?.salesmanName || 'Default Location'}</h4>  
        <button className="back-button" onClick={handleBackToDashboard}>
          Back To Dashboard
        </button>
      </div>
      
      <MapContainer
        center={coordinates}
        zoom={13}
        className="map-container"
        key={salesman?._id || 'default-map'}
        
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Marker position={coordinates}>
          <Popup>
            <div className="popup-content">
              <h4>{salesman?.salesmanName || 'Default Location'}</h4>
              <p>
                {salesman 
                  ? `Last updated: ${new Date().toLocaleTimeString()}`
                  : 'Simulated default location'}
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

export default LiveMap