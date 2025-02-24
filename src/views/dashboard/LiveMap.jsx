// // import React from 'react'
// // import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
// // import 'leaflet/dist/leaflet.css'
// // import './LiveMap.css' // Import the CSS file
// // import { useLocation, useNavigate } from 'react-router-dom'
// // import L from 'leaflet'
// // import markerIcon from 'leaflet/dist/images/marker-icon.png'
// // import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// // const DefaultIcon = L.icon({
// //   iconUrl: markerIcon,
// //   shadowUrl: markerShadow,
// //   iconSize: [25, 41],
// //   iconAnchor: [12, 41],
// //   popupAnchor: [1, -34],
// //   shadowSize: [41, 41]
// // })

// // L.Marker.prototype.options.icon = DefaultIcon

// // const DEFAULT_POSITION = [17.3850, 78.4867]

// // const LiveMap = () => {
// //   const navigate = useNavigate()
// //   const location = useLocation()
// //   const { salesman } = location.state || {}

// //   const coordinates = salesman?.location?.coordinates 
// //   ? [
// //       salesman.location.coordinates[1], 
// //       salesman.location.coordinates[0]
// //     ] 
// //   : DEFAULT_POSITION

// //   const handleBackToDashboard = () => navigate('/dashboard')

// //   return (
// //     <div className="live-map-container">
// //       <div className="header-container" style={{marginTop:'-14px', marginBottom:'3px'}}>
// //         <h4>{salesman?.salesmanName || 'Default Location'}</h4>  
// //         <button className="back-button" onClick={handleBackToDashboard}>
// //           Back To Dashboard
// //         </button>
// //       </div>
      
// //       <MapContainer
// //         center={coordinates}
// //         zoom={13}
// //         className="map-container"
// //         key={salesman?._id || 'default-map'}
        
// //       >
// //         <TileLayer
// //           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// //           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //         />
        
// //         <Marker position={coordinates}>
// //           <Popup>
// //             <div className="popup-content">
// //               <h4>{salesman?.salesmanName || 'Default Location'}</h4>
// //               <p>
// //                 {salesman 
// //                   ? `Last updated: ${new Date().toLocaleTimeString()}`
// //                   : 'Simulated default location'}
// //               </p>
// //             </div>
// //           </Popup>
// //         </Marker>
// //       </MapContainer>
// //     </div>
// //   )
// // }

// // export default LiveMap
// // import React from 'react'
// // import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
// // import 'leaflet/dist/leaflet.css'
// // import './LiveMap.css' // Import the CSS file
// // import { useLocation, useNavigate } from 'react-router-dom'
// // import L from 'leaflet'
// // import markerIcon from 'leaflet/dist/images/marker-icon.png'
// // import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// // const DefaultIcon = L.icon({
// //   iconUrl: markerIcon,
// //   shadowUrl: markerShadow,
// //   iconSize: [25, 41],
// //   iconAnchor: [12, 41],
// //   popupAnchor: [1, -34],
// //   shadowSize: [41, 41]
// // })

// // L.Marker.prototype.options.icon = DefaultIcon

// // const DEFAULT_POSITION = [17.3850, 78.4867]

// // const LiveMap = () => {
// //   const navigate = useNavigate()
// //   const location = useLocation()
// //   const { salesman } = location.state || {}

// //   const coordinates = salesman?.location?.coordinates 
// //   ? [
// //       salesman.location.coordinates[1], 
// //       salesman.location.coordinates[0]
// //     ] 
// //   : DEFAULT_POSITION

// //   const handleBackToDashboard = () => navigate('/dashboard')

// //   return (
// //     <div className="live-map-container">
// //       <div className="header-container" style={{marginTop:'-14px', marginBottom:'3px'}}>
// //         <h4>{salesman?.salesmanName || 'Default Location'}</h4>  
// //         <button className="back-button" onClick={handleBackToDashboard}>
// //           Back To Dashboard
// //         </button>
// //       </div>
      
// //       <MapContainer
// //         center={coordinates}
// //         zoom={13}
// //         className="map-container"
// //         key={salesman?._id || 'default-map'}
        
// //       >
// //         <TileLayer
// //           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// //           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //         />
        
// //         <Marker position={coordinates}>
// //           <Popup>
// //             <div className="popup-content">
// //               <h4>{salesman?.salesmanName || 'Default Location'}</h4>
// //               <p>
// //                 {salesman 
// //                   ? `Last updated: ${new Date().toLocaleTimeString()}`
// //                   : 'Simulated default location'}
// //               </p>
// //             </div>
// //           </Popup>
// //         </Marker>
// //       </MapContainer>
// //     </div>
// //   )
// // }

// // export default LiveMap


// // import React, { useEffect, useState } from 'react'
// // import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
// // import 'leaflet/dist/leaflet.css'
// // import './LiveMap.css'
// // import { useLocation, useNavigate } from 'react-router-dom'
// // import L from 'leaflet'
// // import markerIcon from 'leaflet/dist/images/marker-icon.png'
// // import markerShadow from 'leaflet/dist/images/marker-shadow.png'
// // import { io } from 'socket.io-client'

// // const DefaultIcon = L.icon({
// //   iconUrl: markerIcon,
// //   shadowUrl: markerShadow,
// //   iconSize: [25, 41],
// //   iconAnchor: [12, 41],
// //   popupAnchor: [1, -34],
// //   shadowSize: [41, 41]
// // })

// // L.Marker.prototype.options.icon = DefaultIcon

// // const DEFAULT_POSITION = [17.3850, 78.4867]
// // const SOCKET_SERVER_URL = 'http://104.251.218.102:8080'

// // const LiveMap = () => {
// //   const navigate = useNavigate()
// //   const location = useLocation()
// //   const { salesman: initialSalesman } = location.state || {}

// //   const [salesman, setSalesman] = useState(initialSalesman)
// //   const [coordinates, setCoordinates] = useState(DEFAULT_POSITION)
// //   const [lastUpdated, setLastUpdated] = useState(new Date())

// //   useEffect(() => {
// //     if (initialSalesman?.latitude && initialSalesman?.longitude) {
// //       setCoordinates([initialSalesman.latitude, initialSalesman.longitude])
// //     }
// //   }, [initialSalesman])

// //   // Socket connection for real-time updates
// //   useEffect(() => {
// //     if (!initialSalesman?._id) return

// //     const socket = io(SOCKET_SERVER_URL, { transports: ['websocket'] })

// //     socket.on('connect', () => {
// //       console.log('✅ LiveMap connected to socket')
// //     })

// //     socket.on('liveSalesmanData', (data) => {
// //       console.log('📩 Received live location data:', data);
    
// //       if (!initialSalesman?._id) {
// //         console.warn('⚠️ initialSalesman._id is missing');
// //         return;
// //       }
    
// //       console.log('🔍 Checking for salesman with ID:', salesman._id);
// //       console.log('Type of initialSalesman._id:', typeof salesman._id);
// //       console.log('📜 Available IDs:', data.map(s => s._id));
    
// //       const updatedSalesman = data.find(s => String(s._id).trim() === String(salesman._id).trim());
    
// //       if (updatedSalesman) {
// //         console.log('✅ Matching salesman found:', updatedSalesman.salesmanName);
// //         setSalesman(updatedSalesman);
// //         setCoordinates([updatedSalesman.latitude, updatedSalesman.longitude]);
// //         setLastUpdated(new Date());
// //       } else {
// //         console.log('❌ No matching salesman found');
// //       }
// //     });
    
    
    

// //     return () => {
// //       socket.disconnect()
// //       console.log('❌ LiveMap socket disconnected')
// //     }
// //   }, [initialSalesman?._id])

// //   const handleBackToDashboard = () => navigate('/dashboard')

// //   return (
// //     <div className="live-map-container">
// //       <div className="header-container" style={{ marginTop: '-14px', marginBottom: '3px' }}>
// //         <h4>{salesman?.salesmanName || 'Default Location'}</h4>
// //         <button className="back-button" onClick={handleBackToDashboard}>
// //           Back To Dashboard
// //         </button>
// //       </div>

// //       <MapContainer
// //         center={coordinates}
// //         zoom={13}
// //         className="map-container"
// //         key={salesman?._id || 'default-map'}
// //       >
// //         <TileLayer
// //           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// //           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //         />

// //         <Marker position={coordinates}>
// //           <Popup>
// //             <div className="popup-content">
// //               <h4>{salesman?.salesmanName || 'Default Location'}</h4>
// //               <p>
// //                 {salesman 
// //                   ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
// //                   : 'Simulated default location'}
// //               </p>
// //               {salesman?.profileImage && (
// //                 <img
// //                   src={`data:image/png;base64,${salesman.profileImage}`}
// //                   alt="Profile"
// //                   style={{ width: '50px', height: '50px', borderRadius: '50%' }}
// //                 />
// //               )}
// //             </div>
// //           </Popup>
// //         </Marker>
// //       </MapContainer>
// //     </div>
// //   )
// // }

// // export default LiveMap
// import React, { useEffect, useState } from 'react'
// import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
// import 'leaflet/dist/leaflet.css'
// import './LiveMap.css'
// import { useLocation, useNavigate } from 'react-router-dom'
// import L from 'leaflet'
// import markerIcon from 'leaflet/dist/images/marker-icon.png'
// import markerShadow from 'leaflet/dist/images/marker-shadow.png'
// import { io } from 'socket.io-client'

// const DefaultIcon = L.icon({
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41]
// })

// L.Marker.prototype.options.icon = DefaultIcon

// const DEFAULT_POSITION = [17.3850, 78.4867]
// const SOCKET_SERVER_URL = 'http://104.251.218.102:8080'

// const LiveMap = () => {
//   const navigate = useNavigate()
//   const location = useLocation()
//   const { salesman: initialSalesman } = location.state || {}

//   const [salesman, setSalesman] = useState(initialSalesman)
//   const [coordinates, setCoordinates] = useState(DEFAULT_POSITION)
//   const [path, setPath] = useState([]) // Store history of positions
//   const [lastUpdated, setLastUpdated] = useState(new Date())

//   useEffect(() => {
//     if (initialSalesman?.latitude && initialSalesman?.longitude) {
//       const newCoordinates = [initialSalesman.latitude, initialSalesman.longitude]
//       setCoordinates(newCoordinates)
//       setPath([newCoordinates]) // Initialize path
//     }
//   }, [initialSalesman])

//   // Socket connection for real-time updates
//   useEffect(() => {
//     if (!initialSalesman?._id) return

//     const socket = io(SOCKET_SERVER_URL, { transports: ['websocket'] })

//     socket.on('connect', () => {
//       console.log('✅ LiveMap connected to socket')
//     })

//     socket.on('liveSalesmanData', (data) => {
//       console.log('📩 Received live location data:', data);
    
//       if (!initialSalesman?.salesmanName) {
//         console.warn('⚠️ initialSalesman.salesmanName is missing');
//         return;
//       }
    
//       console.log('🔍 Checking for salesman with Name:', initialSalesman.salesmanName);
//       console.log('📜 Available Names:', data.map(s => s.salesmanName));
    
//       const updatedSalesman = data.find(s => String(s.salesmanName).trim().toLowerCase() === String(initialSalesman.salesmanName).trim().toLowerCase());
    
//       if (updatedSalesman) {
//         console.log('✅ Matching salesman found:', updatedSalesman.salesmanName);
    
//         const newCoordinates = [updatedSalesman.latitude, updatedSalesman.longitude];
    
//         setSalesman(updatedSalesman);
//         setCoordinates(newCoordinates);
//         setPath(prevPath => [...prevPath, newCoordinates]); // Append new location to path
//         setLastUpdated(new Date());
//       } else {
//         console.log('❌ No matching salesman found');
//       }
//     });
    

//     return () => {
//       socket.disconnect()
//       console.log('❌ LiveMap socket disconnected')
//     }
//   }, [initialSalesman?._id])

//   const handleBackToDashboard = () => navigate('/dashboard')

//   return (
//     <div className="live-map-container">
//       <div className="header-container" style={{ marginTop: '-14px', marginBottom: '3px' }}>
//         <h4>{salesman?.salesmanName || 'Default Location'}</h4>
//         <button className="back-button" onClick={handleBackToDashboard}>
//           Back To Dashboard
//         </button>
//       </div>

//       <MapContainer
//         center={coordinates}
//         zoom={13}
//         className="map-container"
//         key={salesman?._id || 'default-map'}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         {/* Salesman Marker */}
//         <Marker position={coordinates}>
//           <Popup>
//             <div className="popup-content">
//               <h4>{salesman?.salesmanName || 'Default Location'}</h4>
//               <h4>{salesman?.latitude || 'Default Location'}</h4>
//               <h4>{salesman?.longitude || 'Default Location'}</h4>
//               <p>
//                 {salesman 
//                   ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
//                   : 'Simulated default location'}
//               </p>
//               {salesman?.profileImage && (
//                 <img
//                   src={`data:image/png;base64,${salesman.profileImage}`}
//                   alt="Profile"
//                   style={{ width: '50px', height: '50px', borderRadius: '50%' }}
//                 />
//               )}
//             </div>
//           </Popup>
//         </Marker>

//         {/* Polyline to show movement path */}
//         {path.length > 1 && <Polyline positions={path} color="blue" />}

//       </MapContainer>
//     </div>
//   )
// }

// export default LiveMap

import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './LiveMap.css';
import { useLocation, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { io } from 'socket.io-client';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const DEFAULT_POSITION = [17.3850, 78.4867];
const SOCKET_SERVER_URL = 'http://104.251.218.102:8080';

const LiveMap = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { salesman: initialSalesman } = location.state || {};

  const [salesman, setSalesman] = useState(initialSalesman);
  const [coordinates, setCoordinates] = useState(DEFAULT_POSITION);
  const [path, setPath] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoFocus, setAutoFocus] = useState(true); // 🔹 Toggle for auto-focus

  const mapRef = useRef(null); // 🔹 Ref for the map instance

  useEffect(() => {
    if (initialSalesman?.latitude && initialSalesman?.longitude) {
      const newCoordinates = [initialSalesman.latitude, initialSalesman.longitude];
      setCoordinates(newCoordinates);
      setPath([newCoordinates]);
    }
  }, [initialSalesman]);

  useEffect(() => {
    if (!initialSalesman?.salesmanName) return;

    const socket = io(SOCKET_SERVER_URL, { transports: ['websocket'] });

    socket.on('connect', () => {
      console.log('✅ LiveMap connected to socket');
    });

    socket.on('liveSalesmanData', (data) => {
      console.log("mydata",data);
      const updatedSalesman = data.find(s =>
        String(s.salesmanName).trim().toLowerCase() === String(initialSalesman.salesmanName).trim().toLowerCase()
      );

      if (updatedSalesman) {
        console.log('✅ Matching salesman found:', updatedSalesman.salesmanName);
        const newCoordinates = [updatedSalesman.latitude, updatedSalesman.longitude];

        setSalesman(updatedSalesman);
        setCoordinates(newCoordinates);
        setPath(prevPath => [...prevPath, newCoordinates]);
        setLastUpdated(new Date());

        if (autoFocus && mapRef.current) {
          mapRef.current.flyTo(newCoordinates, 17); // 🔹 Smooth zoom to salesman
        }
      }
    });

    return () => {
      socket.disconnect();
      console.log('❌ LiveMap socket disconnected');
    };
  }, [initialSalesman?.salesmanName, autoFocus]);

  const handleBackToDashboard = () => navigate('/dashboard');

  return (
    <div className="live-map-container">
      <div className="header-container" style={{ marginTop: '-14px', marginBottom: '3px' }}>
        <h4>{salesman?.salesmanName || 'Default Location'}</h4>
        <button className="back-button" onClick={handleBackToDashboard}>Back To Dashboard</button>
        <button 
          className="toggle-button" 
          onClick={() => setAutoFocus(prev => !prev)}
          style={{ marginLeft: '10px', backgroundColor: autoFocus ? 'green' : 'red', color: 'white' }}
        >
          {autoFocus ? 'Auto-Focus: ON' : 'Auto-Focus: OFF'}
        </button>
      </div>

      <MapContainer 
        center={coordinates} 
        zoom={13} 
        className="map-container" 
        key={salesman?.salesmanName || 'default-map'}
        whenCreated={mapInstance => (mapRef.current = mapInstance)} // 🔹 Store map instance
      >
        <TileLayer 
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={coordinates}>
          <Popup>
            <div className="popup-content">
              <h4>{salesman?.salesmanName || 'Default Location'}</h4>
              <h4>{salesman?.latitude || 'Default Location'}</h4>
              <h4>{salesman?.longitude || 'Default Location'}</h4>
              <p>Last updated: {lastUpdated.toLocaleTimeString()}</p>
              {salesman?.profileImage && (
                <img
                  src={`data:image/png;base64,${salesman.profileImage}`}
                  alt="Profile"
                  style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                />
              )}
            </div>
          </Popup>
        </Marker>

        {path.length > 1 && <Polyline positions={path} color="blue" />}
      </MapContainer>
    </div>
  );
};

export default LiveMap;
