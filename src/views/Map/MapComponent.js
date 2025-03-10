import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Cookies from 'js-cookie';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import location from 'src/assets/location.png';
import { format } from 'date-fns';


// Custom marker icon configuration
const customIcon = L.icon({
  iconUrl: location, // URL of your custom marker image
  iconSize: [48, 48], // Size of the icon (width, height)
  iconAnchor: [24, 48], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -48], // Point from which the popup should open relative to the iconAnchor
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png', // Optional shadow URL
  shadowSize: [41, 41], // Size of the shadow
  shadowAnchor: [13, 41], // Point of the shadow which will correspond to marker's location
});

const MainMap = () => {
  const SOCKET_SERVER_URL = import.meta.env.VITE_SERVER_URL; // Server URL from environment variables
  const [salesmen, setSalesmen] = useState([]); // State to store salesman data
  const [mapCenter] = useState([21.1458, 79.0882]); // Default map center (Nagpur)
  const navigate = useNavigate(); // Hook to navigate to different routes

  // Connect to the socket server and listen for updates
  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    const token = Cookies.get('token'); // Get authentication token from cookies
    socket.emit('authenticate', token); // Authenticate with the server

    // Handle connection events
    socket.on('connect', () => {
      console.log('✅ Connected to Socket Server');
    });

    // Listen for live salesman location updates
    socket.on('liveSalesmanData', (data) => {
      console.log('📩 Received live location data:', data);

      // Process the data to ensure it has the required fields
      const processedData = data.map((item) => ({
        ...item,
        _id: item._id || 'unknown',
        position: [
          item.latitude || mapCenter[0], // Use provided latitude or fallback to map center
          item.longitude || mapCenter[1], // Use provided longitude or fallback to map center
        ],
        companyName: item.companyId?.companyName || 'Unknown',
        branchName: item.branchId?.branchName || 'Unknown',
        supervisorName: item.supervisorId?.supervisorName || 'Unknown',
        batteryLevel: item.batteryLevel || 'Unknown',
      }));

      setSalesmen(processedData); // Update state with processed data
    });

    // Handle disconnection events
    socket.on('disconnect', (reason) => {
      console.log(`❌ Disconnected: ${reason}`);
    });

    // Handle connection errors
    socket.on('connect_error', (err) => {
      console.error('Connection error:', err.message);
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, [SOCKET_SERVER_URL, mapCenter]);

  return (
    <div className="leaflet-container">
      <MapContainer
        center={mapCenter}
        zoom={10}
        style={{ height: '450px', width: '100%' }}
        scrollWheelZoom={true}
      >
        {/* Tile layer for the map */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">H B Gadget</a>'
        />

        {/* Render markers only for salesmen with valid latitude and longitude */}
        {salesmen
          ?.filter(
            (salesman) =>
              typeof salesman.latitude === 'number' &&
              typeof salesman.longitude === 'number'
          )
          ?.map((salesman) => (
            <Marker
              key={salesman._id}
              position={[salesman.latitude, salesman.longitude]}
              icon={customIcon}
            >
              {/* Popup with salesman details */}
              <Popup>
                <div className="salesman-popup">
                  <h4>{salesman.salesmanName || 'Unknown'}</h4>
                  {/* <p> {salesman.salesmanPhone || 'N/A'}</p> */}
                  {salesman.batteryLevel && (
                    <p> Battery: {salesman.batteryLevel}%</p>
                  )}
                  {/* <p>🏢 {salesman.companyName || 'Unknown Company'}</p>
                  <p>📍 {salesman.branchName || 'Unknown Branch'}</p> */}
                  {salesman.timestamp && (
                    <p>
                    Last update: {format(new Date(salesman.timestamp),'dd MMM yyyy')}
                    </p>
                  )}
                  <button
                    onClick={() =>
                      navigate('/live-map', { state: { salesman } })
                    }
                    style={{
                      marginTop: '10px',
                      padding: '8px 12px',
                      backgroundColor: '#28a745',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Live Track
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
};

export default MainMap;
