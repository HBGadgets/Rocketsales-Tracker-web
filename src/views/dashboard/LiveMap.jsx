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



// -----------------------------------changes code id ----------------------------------
// import React, { useEffect, useState, useRef } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import './LiveMap.css';
// import { useLocation, useNavigate } from 'react-router-dom';
// import L from 'leaflet';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';
// import { io } from 'socket.io-client';

// const DefaultIcon = L.icon({
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41]
// });

// L.Marker.prototype.options.icon = DefaultIcon;

// const DEFAULT_POSITION = [17.3850, 78.4867];
// const SOCKET_SERVER_URL = 'http://104.251.218.102:8080';

// const LiveMap = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { salesman: initialSalesman } = location.state || {};

//   const [salesman, setSalesman] = useState(initialSalesman);
//   const [coordinates, setCoordinates] = useState(DEFAULT_POSITION);
//   const [path, setPath] = useState([]);
//   const [lastUpdated, setLastUpdated] = useState(new Date());
//   const [autoFocus, setAutoFocus] = useState(true); // 🔹 Toggle for auto-focus

//   const mapRef = useRef(null); // 🔹 Ref for the map instance

//   useEffect(() => {
//     if (initialSalesman?.latitude && initialSalesman?.longitude) {
//       const newCoordinates = [initialSalesman.latitude, initialSalesman.longitude];
//       setCoordinates(newCoordinates);
//       setPath([newCoordinates]);
//     }
//   }, [initialSalesman]);

//   useEffect(() => {
//     if (!initialSalesman?.salesmanName) return;

//     const socket = io(SOCKET_SERVER_URL, { transports: ['websocket'] });

//     socket.on('connect', () => {
//       console.log('✅ LiveMap connected to socket');
//     });

//     socket.on('liveSalesmanData', (data) => {
//       console.log("mydata",data);
//       const updatedSalesman = data.find(s =>
//         String(s.username).trim().toLowerCase() === String(initialSalesman.username).trim().toLowerCase()
//       );

//       if (updatedSalesman) {
//         console.log('✅ Matching salesman found:', updatedSalesman.salesmanName);
//         const newCoordinates = [updatedSalesman.latitude, updatedSalesman.longitude];

//         setSalesman(updatedSalesman);
//         setCoordinates(newCoordinates);
//         setPath(prevPath => [...prevPath, newCoordinates]);
//         setLastUpdated(new Date());

//         if (autoFocus && mapRef.current) {
//           mapRef.current.flyTo(newCoordinates, 17);
//         }
//       }
//     });

//     return () => {
//       socket.disconnect();
//       console.log('❌ LiveMap socket disconnected');
//     };
//   }, [initialSalesman?.salesmanName, autoFocus]);

//   const handleBackToDashboard = () => navigate('/dashboard');

//   return (
//     <div className="live-map-container">
//       <div className="header-container" style={{ marginTop: '-14px', marginBottom: '3px' }}>
//         <h4>{salesman?.salesmanName || 'Default Location'}</h4>
//         <button className="back-button" onClick={handleBackToDashboard}>Back To Dashboard</button>
//         <button
//           className="toggle-button"
//           onClick={() => setAutoFocus(prev => !prev)}
//           style={{ marginLeft: '10px', backgroundColor: autoFocus ? 'green' : 'red', color: 'white' }}
//         >
//           {autoFocus ? 'Auto-Focus: ON' : 'Auto-Focus: OFF'}
//         </button>
//       </div>

//       <MapContainer
//         center={coordinates}
//         zoom={13}
//         className="map-container"
//         key={salesman?.salesmanName || 'default-map'}
//         whenCreated={mapInstance => (mapRef.current = mapInstance)} // 🔹 Store map instance
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         <Marker position={coordinates}>
//           <Popup>
//             <div className="popup-content">
//               <h4>{salesman?.salesmanName || 'Default Location'}</h4>
//               <h4>{salesman?.latitude || 'Default Location'}</h4>
//               <h4>{salesman?.longitude || 'Default Location'}</h4>
//               <p>Last updated: {lastUpdated.toLocaleTimeString()}</p>
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

//         {path.length > 1 && <Polyline positions={path} color="blue" />}
//       </MapContainer>
//     </div>
//   );
// };



// ----------------arrowicon code-----------------------------
// export default LiveMap;
// import React, { useEffect, useState, useRef } from 'react'
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
// import 'leaflet/dist/leaflet.css'
// import 'leaflet-rotatedmarker'
// import './LiveMap.css'
// import { useLocation, useNavigate } from 'react-router-dom'
// import L from 'leaflet'
// import markerIcon from 'leaflet/dist/images/marker-icon.png'
// import markerShadow from 'leaflet/dist/images/marker-shadow.png'
// import arrowIcon from './forward-vector-icon.jpg' // Import your arrow icon
// import { io } from 'socket.io-client'

// const ArrowIcon = L.icon({
//   iconUrl: arrowIcon,
//   shadowUrl: markerShadow,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// })

// const DEFAULT_POSITION = [17.385, 78.4867]
// const SOCKET_SERVER_URL = 'http://104.251.218.102:8080'

// const RotatedMarker = ({ position, rotationAngle, icon, children }) => {
//   const markerRef = useRef(null)

//   useEffect(() => {
//     if (markerRef.current && rotationAngle != null) {
//       markerRef.current.setRotationAngle(rotationAngle)
//     }
//   }, [rotationAngle])

//   return (
//     <Marker
//       ref={(ref) => {
//         markerRef.current = ref
//       }}
//       position={position}
//       icon={icon}
//     >
//       {children}
//     </Marker>
//   )
// }

// const calculateBearing = (prevCoords, newCoords) => {
//   const prevLat = (prevCoords[0] * Math.PI) / 180
//   const prevLon = (prevCoords[1] * Math.PI) / 180
//   const newLat = (newCoords[0] * Math.PI) / 180
//   const newLon = (newCoords[1] * Math.PI) / 180

//   const y = Math.sin(newLon - prevLon) * Math.cos(newLat)
//   const x =
//     Math.cos(prevLat) * Math.sin(newLat) -
//     Math.sin(prevLat) * Math.cos(newLat) * Math.cos(newLon - prevLon)
//   let angle = Math.atan2(y, x)
//   angle = (angle * 180) / Math.PI
//   return (angle + 360) % 360
// }

// const LiveMap = () => {
//   const navigate = useNavigate()
//   const location = useLocation()
//   const { salesman: initialSalesman } = location.state || {}

//   const [salesman, setSalesman] = useState(initialSalesman)
//   const [coordinates, setCoordinates] = useState(DEFAULT_POSITION)
//   const [path, setPath] = useState([])
//   const [bearing, setBearing] = useState(0)
//   const [lastUpdated, setLastUpdated] = useState(new Date())
//   const [autoFocus, setAutoFocus] = useState(true)

//   const mapRef = useRef(null)
//   const previousCoordsRef = useRef(coordinates)
//   const pathRef = useRef([])

//   useEffect(() => {
//     if (initialSalesman?.latitude && initialSalesman?.longitude) {
//       const newCoordinates = [Number(initialSalesman.latitude), Number(initialSalesman.longitude)]
//       setCoordinates(newCoordinates)
//       pathRef.current = [newCoordinates]
//       setPath(pathRef.current)
//       previousCoordsRef.current = newCoordinates
//     }
//   }, [initialSalesman])

//   useEffect(() => {
//     if (!initialSalesman?.salesmanName) return

//     const socket = io(SOCKET_SERVER_URL, { transports: ['websocket'] })

//     socket.on('liveSalesmanData', (data) => {
//       const updatedSalesman = data.find(
//         (s) =>
//           String(s.username).trim().toLowerCase() ===
//           String(initialSalesman.username).trim().toLowerCase(),
//       )

//       if (updatedSalesman) {
//         const newCoordinates = [Number(updatedSalesman.latitude), Number(updatedSalesman.longitude)]

//         const bearing = calculateBearing(previousCoordsRef.current, newCoordinates)
//         previousCoordsRef.current = newCoordinates

//         setSalesman(updatedSalesman)
//         setCoordinates(newCoordinates)
//         setBearing(bearing)
//         setLastUpdated(new Date())

//         pathRef.current = [...pathRef.current, newCoordinates]
//         if (pathRef.current.length % 5 === 0) {
//           setPath([...pathRef.current])
//         }

//         // if (autoFocus && mapRef.current) {
//         //   mapRef.current.flyTo(newCoordinates, 19, {
//         //     duration: 1.5,
//         //     easeLinearity: 0.25,
//         //   })
//         // }
//         if (autoFocus && mapRef.current) {
//           mapRef.current.flyTo(newCoordinates, 17, {
//             duration: 0.8, // Reduce duration for a smoother transition
//             easeLinearity: 0.5, // Make movement gradual
//           })
//         }
        
//       }
//     })

//     return () => socket.disconnect()
//   }, [initialSalesman?.salesmanName, autoFocus])

//   const handleBackToDashboard = () => navigate('/dashboard')

//   return (
//     <div className="live-map-container">
//       <div className="header-container">
//         <h4>{salesman?.salesmanName || 'Default Location'}</h4>
//         <button className="back-button" onClick={handleBackToDashboard}>
//           Back To Dashboard
//         </button>
//         <button
//           className="toggle-button"
//           onClick={() => setAutoFocus((prev) => !prev)}
//           style={{ backgroundColor: autoFocus ? 'green' : 'red' }}
//         >
//           {autoFocus ? 'Auto-Focus: ON' : 'Auto-Focus: OFF'}
//         </button>
//       </div>

//       <MapContainer
//         center={coordinates}
//         zoom={17}
//         maxZoom={17}
//         className="map-container"
//         ref={mapRef}
//       >
//        <TileLayer
//   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//   attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// />

//         <RotatedMarker position={coordinates} rotationAngle={bearing} icon={ArrowIcon}>
//           <Popup>
//             <div className="popup-content">
//               <h4>{salesman?.salesmanName}</h4>
//               <p>Latitude: {coordinates[0]?.toFixed(6)}</p>
//               <p>Longitude: {coordinates[1]?.toFixed(6)}</p>
//               <p>Last updated: {lastUpdated.toLocaleTimeString()}</p>
//               {salesman?.profileImage && (
//                 <img
//                   src={`data:image/png;base64,${salesman.profileImage}`}
//                   alt="Profile"
//                   style={{ width: '50px', height: '50px', borderRadius: '50%' }}
//                 />
//               )}
//             </div>
//           </Popup>
//         </RotatedMarker>

//         <Polyline positions={path} color="#3388ff" weight={3} dashArray="5, 7" />
//       </MapContainer>
//     </div>
//   )
// }

// export default LiveMap









// --------------------------autozoomcode----------------------------------------------------
// import React, { useEffect, useState, useRef } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import './LiveMap.css';
// import { useLocation, useNavigate } from 'react-router-dom';
// import L from 'leaflet';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';
// import { io } from 'socket.io-client';

// // Set up default Leaflet marker
// const DefaultIcon = L.icon({
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41]
// });

// L.Marker.prototype.options.icon = DefaultIcon;

// const DEFAULT_POSITION = [17.3850, 78.4867];
// const SOCKET_SERVER_URL = 'http://104.251.218.102:8080';

// const LiveMap = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { salesman: initialSalesman } = location.state || {};

//   const [salesman, setSalesman] = useState(initialSalesman);
//   const [coordinates, setCoordinates] = useState(DEFAULT_POSITION);
//   const [path, setPath] = useState([]);
//   const [lastUpdated, setLastUpdated] = useState(new Date());
//   const [autoFocus, setAutoFocus] = useState(true);

//   const mapRef = useRef(null);
//   const previousCoordsRef = useRef(coordinates);
//   const pathRef = useRef([]);

//   useEffect(() => {
//     if (initialSalesman?.latitude && initialSalesman?.longitude) {
//       const newCoordinates = [Number(initialSalesman.latitude), Number(initialSalesman.longitude)];
//       setCoordinates(newCoordinates);
//       pathRef.current = [newCoordinates];
//       setPath(pathRef.current);
//       previousCoordsRef.current = newCoordinates;
//     }
//   }, [initialSalesman]);

//   useEffect(() => {
//     if (!initialSalesman?.salesmanName) return;

//     const socket = io(SOCKET_SERVER_URL, { transports: ['websocket'] });

//     socket.on('liveSalesmanData', (data) => {
//       const updatedSalesman = data.find(
//         (s) =>
//           String(s.username).trim().toLowerCase() ===
//           String(initialSalesman.username).trim().toLowerCase()
//       );
//        console.log("mydata",data)
//       if (updatedSalesman) {
//         const newCoordinates = [Number(updatedSalesman.latitude), Number(updatedSalesman.longitude)];
//         console.log("updatedsal",updatedSalesman)
//         previousCoordsRef.current = newCoordinates;

//         setSalesman(updatedSalesman);
//         setCoordinates(newCoordinates);
//         setLastUpdated(new Date());

//         pathRef.current = [...pathRef.current, newCoordinates];
//         if (pathRef.current.length % 5 === 0) {
//           setPath([...pathRef.current]);
//         }

//         if (autoFocus && mapRef.current) {
//           mapRef.current.flyTo(newCoordinates, 18, {
//             duration: 0.8,
//             easeLinearity: 0.5,
//           });
//         }
//       }
//     });

//     return () => socket.disconnect();
//   }, [initialSalesman?.salesmanName, autoFocus]);

//   const handleBackToDashboard = () => navigate('/dashboard');

//   return (
//     <div className="live-map-container">
//       <div className="header-container">
//         <h4>{salesman?.salesmanName || 'Default Location'}</h4>
//         <button className="back-button" onClick={handleBackToDashboard}>
//           Back To Dashboard
//         </button>
//         <button
//           className="toggle-button"
//           onClick={() => setAutoFocus((prev) => !prev)}
//           style={{ backgroundColor: autoFocus ? 'green' : 'red' }}
//         >
//           {autoFocus ? 'Auto-Focus: ON' : 'Auto-Focus: OFF'}
//         </button>
//       </div>

//       <MapContainer
//         center={coordinates}
//         zoom={13}
//         maxZoom={13}
//         className="map-container"
//         ref={mapRef}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />

//         <Marker position={coordinates}>
//           <Popup>
//             <div className="popup-content">
//               <h4>{salesman?.salesmanName}</h4>
//               <p>Latitude: {coordinates[0]?.toFixed(6)}</p>
//               <p>Longitude: {coordinates[1]?.toFixed(6)}</p>
//               <p>Last updated: {lastUpdated.toLocaleTimeString()}</p>
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

//         <Polyline positions={path} color="#3388ff" weight={3} dashArray="5, 7" />
//       </MapContainer>
//     </div>
//   );
// };

// export default LiveMap;



//------------------------sudesh logic code-----------------
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './LiveMap.css';
import { useLocation, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { io } from 'socket.io-client';
import ReactLeafletDriftMarker from 'react-leaflet-drift-marker';

// Set up default Leaflet marker
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

// Animation Controller Component
const MapController = ({ coordinates, previousPosition, polylineRef, autoFocus }) => {
  const map = useMap();
  const animationRef = useRef(null);

  // Easing function: easeInOutQuad
  const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

  useEffect(() => {
    if (coordinates && map && autoFocus) {
      const targetPosition = coordinates;
      
      if (previousPosition.current) {
        const duration = 2000; // 2 seconds animation
        let startTime;

        const animateMarker = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const elapsedTime = timestamp - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          const easedProgress = easeInOutQuad(progress);

          // Calculate intermediate position
          const newLat = previousPosition.current[0] + 
            (coordinates[0] - previousPosition.current[0]) * easedProgress;
          const newLng = previousPosition.current[1] + 
            (coordinates[1] - previousPosition.current[1]) * easedProgress;

          // Update polyline
          if (polylineRef.current) {
            const currentPath = polylineRef.current.getLatLngs();
            currentPath.push([newLat, newLng]);
            polylineRef.current.setLatLngs(currentPath);
          }

          // Update map view
          map.setView([newLat, newLng], map.getZoom(), { animate: true });

          if (progress < 1) {
            animationRef.current = requestAnimationFrame(animateMarker);
          } else {
            previousPosition.current = coordinates;
          }
        };

        animationRef.current = requestAnimationFrame(animateMarker);
        
        return () => {
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }
        };
      } else {
        previousPosition.current = coordinates;
      }
    }
  }, [coordinates, map, autoFocus]);

  return null;
};

const LiveMap = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { salesman: initialSalesman } = location.state || {};

  const [salesman, setSalesman] = useState(initialSalesman);
  const [coordinates, setCoordinates] = useState(DEFAULT_POSITION);
  const [path, setPath] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoFocus, setAutoFocus] = useState(true);

  const mapRef = useRef(null);
  const previousPosition = useRef(coordinates);
  const polylineRef = useRef(null);
  const pathRef = useRef([]);

  useEffect(() => {
    if (initialSalesman?.latitude && initialSalesman?.longitude) {
      const newCoordinates = [
        Number(initialSalesman.latitude),
        Number(initialSalesman.longitude)
      ];
      setCoordinates(newCoordinates);
      pathRef.current = [newCoordinates];
      setPath(pathRef.current);
      previousPosition.current = newCoordinates;
    }
  }, [initialSalesman]);

  useEffect(() => {
    if (!initialSalesman?.salesmanName) return;

    const socket = io(SOCKET_SERVER_URL, { transports: ['websocket'] });

    socket.on('liveSalesmanData', (data) => {
      const updatedSalesman = data.find(
        s => String(s.username).trim().toLowerCase() === 
             String(initialSalesman.username).trim().toLowerCase()
      );
console.log(data)
      if (updatedSalesman) {
        const newCoordinates = [
          Number(updatedSalesman.latitude),
          Number(updatedSalesman.longitude)
        ];

        setSalesman(updatedSalesman);
        setCoordinates(newCoordinates);
        setLastUpdated(new Date());

        pathRef.current = [...pathRef.current, newCoordinates];
        if (pathRef.current.length % 5 === 0) {
          setPath([...pathRef.current]);
        }
      }
    });

    return () => socket.disconnect();
  }, [initialSalesman?.salesmanName, autoFocus]);

  const handleBackToDashboard = () => navigate('/dashboard');

  return (
    <div className="live-map-container">
      <div className="header-container">
        <h4>{salesman?.salesmanName || 'Default Location'}</h4>
        <button className="back-button" onClick={handleBackToDashboard}>
          Back To Dashboard
        </button>
        <button
          className="toggle-button"
          onClick={() => setAutoFocus((prev) => !prev)}
          style={{ backgroundColor: autoFocus ? 'green' : 'red' }}
        >
          {autoFocus ? 'Auto-Focus: ON' : 'Auto-Focus: OFF'}
        </button>
      </div>

      <MapContainer
        center={coordinates}
        zoom={13}
        className="map-container"
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <ReactLeafletDriftMarker
          position={coordinates}
          icon={DefaultIcon}
          duration={2000}
        >
          <Popup>
            <div className="popup-content">
              <h4>{salesman?.salesmanName}</h4>
              <p>Latitude: {coordinates[0]?.toFixed(6)}</p>
              <p>Longitude: {coordinates[1]?.toFixed(6)}</p>
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
        </ReactLeafletDriftMarker>
        {/* <Polyline 
  ref={polylineRef} 
  positions={path} 
  color="#0066cc"  // Darker blue color
  weight={5}       // Thicker line
  opacity={0.8}    // Slightly transparent
  fillOpacity={1}  // Solid fill
  lineJoin="round" // Smoother line joints
  eventHandlers={{
    mouseover: (e) => {
      e.target.setStyle({
        color: "#004499", // Even darker on hover
        weight: 6
      });
    },
    mouseout: (e) => {
      e.target.setStyle({
        color: "#0066cc",
        weight: 5
      });
    }
  }}
/> */}
    <Polyline 
          ref={polylineRef} 
          positions={path} 
          color="#3388ff" 
          weight={3} 
          dashArray="5, 7" 
        />
        <MapController
          coordinates={coordinates}
          previousPosition={previousPosition}
          polylineRef={polylineRef}
          autoFocus={autoFocus}
        />
      </MapContainer>
    </div>
  );
};

export default LiveMap;