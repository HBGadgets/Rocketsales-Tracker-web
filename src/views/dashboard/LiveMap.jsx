



// //------------------------proper code-----------------
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
        const duration = 1000; // 2 seconds animation
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
          duration={1000}
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



//----------------arrow add--------------------------




//------------------------proper code-----------------
// import React, { useEffect, useState, useRef } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import './LiveMap.css';
// import { useLocation, useNavigate } from 'react-router-dom';
// import L from 'leaflet';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';
// import { io } from 'socket.io-client';
// import ReactLeafletDriftMarker from 'react-leaflet-drift-marker';

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

// // Animation Controller Component
// const MapController = ({ coordinates, previousPosition, polylineRef, autoFocus }) => {
//   const map = useMap();
//   const animationRef = useRef(null);

//   // Easing function: easeInOutQuad
//   const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

//   useEffect(() => {
//     if (coordinates && map && autoFocus) {
//       const targetPosition = coordinates;
      
//       if (previousPosition.current) {
//         const duration = 1000; // 2 seconds animation
//         let startTime;

//         const animateMarker = (timestamp) => {
//           if (!startTime) startTime = timestamp;
//           const elapsedTime = timestamp - startTime;
//           const progress = Math.min(elapsedTime / duration, 1);
//           const easedProgress = easeInOutQuad(progress);

//           // Calculate intermediate position
//           const newLat = previousPosition.current[0] + 
//             (coordinates[0] - previousPosition.current[0]) * easedProgress;
//           const newLng = previousPosition.current[1] + 
//             (coordinates[1] - previousPosition.current[1]) * easedProgress;

//           // Update polyline
//           if (polylineRef.current) {
//             const currentPath = polylineRef.current.getLatLngs();
//             currentPath.push([newLat, newLng]);
//             polylineRef.current.setLatLngs(currentPath);
//           }

//           // Update map view
//           map.setView([newLat, newLng], map.getZoom(), { animate: true });

//           if (progress < 1) {
//             animationRef.current = requestAnimationFrame(animateMarker);
//           } else {
//             previousPosition.current = coordinates;
//           }
//         };

//         animationRef.current = requestAnimationFrame(animateMarker);
        
//         return () => {
//           if (animationRef.current) {
//             cancelAnimationFrame(animationRef.current);
//           }
//         };
//       } else {
//         previousPosition.current = coordinates;
//       }
//     }
//   }, [coordinates, map, autoFocus]);

//   return null;
// };

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
//   const previousPosition = useRef(coordinates);
//   const polylineRef = useRef(null);
//   const pathRef = useRef([]);

//   useEffect(() => {
//     if (initialSalesman?.latitude && initialSalesman?.longitude) {
//       const newCoordinates = [
//         Number(initialSalesman.latitude),
//         Number(initialSalesman.longitude)
//       ];
//       setCoordinates(newCoordinates);
//       pathRef.current = [newCoordinates];
//       setPath(pathRef.current);
//       previousPosition.current = newCoordinates;
//     }
//   }, [initialSalesman]);

//   useEffect(() => {
//     if (!initialSalesman?.salesmanName) return;

//     const socket = io(SOCKET_SERVER_URL, { transports: ['websocket'] });

//     socket.on('liveSalesmanData', (data) => {
//       const updatedSalesman = data.find(
//         s => String(s.username).trim().toLowerCase() === 
//              String(initialSalesman.username).trim().toLowerCase()
//       );
// console.log(data)
//       if (updatedSalesman) {
//         const newCoordinates = [
//           Number(updatedSalesman.latitude),
//           Number(updatedSalesman.longitude)
//         ];

//         setSalesman(updatedSalesman);
//         setCoordinates(newCoordinates);
//         setLastUpdated(new Date());

//         pathRef.current = [...pathRef.current, newCoordinates];
//         if (pathRef.current.length % 5 === 0) {
//           setPath([...pathRef.current]);
//         }
//       }
//     });

//     return () => socket.disconnect();
//   }, [initialSalesman?.salesmanName, autoFocus]);

//   const handleBackToDashboard = () => navigate('/dashboard');

//   // Add this new icon configuration above the LiveMap component
//   const ForwardIcon = L.icon({
//     iconUrl: 'https://cdn-icons-png.flaticon.com/512/271/271226.png', // Use any forward arrow icon
//     iconSize: [25, 25],
//     iconAnchor: [12, 12],
//     className: 'direction-arrow'
//   });
  
//   // Add this function above the LiveMap component
//   const calculateBearing = (pointA, pointB) => {
//     const toRad = deg => deg * (Math.PI / 180);
//     const lat1 = toRad(pointA[0]);
//     const lon1 = toRad(pointA[1]);
//     const lat2 = toRad(pointB[0]);
//     const lon2 = toRad(pointB[1]);
  
//     const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
//     const x = Math.cos(lat1) * Math.sin(lat2) - 
//              Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
//     let bearing = Math.atan2(y, x);
//     bearing = bearing * (180 / Math.PI);
//     return (bearing + 360) % 360;
//   };
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
//         className="map-container"
//         ref={mapRef}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />

//         <ReactLeafletDriftMarker
//           position={coordinates}
//           icon={DefaultIcon}
//           duration={1000}
//         >
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
//         </ReactLeafletDriftMarker>
//         {/* <Polyline 
//   ref={polylineRef} 
//   positions={path} 
//   color="#0066cc"  // Darker blue color
//   weight={5}       // Thicker line
//   opacity={0.8}    // Slightly transparent
//   fillOpacity={1}  // Solid fill
//   lineJoin="round" // Smoother line joints
//   eventHandlers={{
//     mouseover: (e) => {
//       e.target.setStyle({
//         color: "#004499", // Even darker on hover
//         weight: 6
//       });
//     },
//     mouseout: (e) => {
//       e.target.setStyle({
//         color: "#0066cc",
//         weight: 5
//       });
//     }
//   }}
// /> */}
//     <Polyline 
//           ref={polylineRef} 
//           positions={path} 
//           color="#3388ff" 
//           weight={3} 
//           dashArray="5, 7" 
//         />
//         {path.map((coord, index) => {
//   if ((index + 1) % 10 === 0 && index < path.length - 1) {
//     const nextCoord = path[index + 1];
//     const rotation = calculateBearing(coord, nextCoord);
    
//     return (
//       <Marker
//         key={`direction-${index}`}
//         position={coord}
//         icon={L.icon({
//           ...ForwardIcon.options,
//           iconUrl: ForwardIcon.options.iconUrl,
//           iconSize: [20, 20],
//           className: `direction-arrow-${index}`
//         })}
//         rotationAngle={rotation}
//         rotationOrigin="center"
//       />
//     );
//   }
//   return null;
// })}
//         <MapController
//           coordinates={coordinates}
//           previousPosition={previousPosition}
//           polylineRef={polylineRef}
//           autoFocus={autoFocus}
//         />
//       </MapContainer>
//     </div>
//   );
// };

// export default LiveMap;



//----------------arrow add--------------------------




//------------------------proper code-----------------
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
import locationIcon from 'src/assets/location.png';

// Set up default Leaflet marker
const DefaultIcon = L.icon({
  iconUrl: locationIcon,
  shadowUrl: markerShadow,
  iconSize: [51, 51],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
const pulsingIcon = L.divIcon({
  className: '', // Leave empty to avoid default styles
  html: `
    <div class="marker-container">
      <img src="${locationIcon}" alt="marker icon" style="width:51px; height:51px;">
      <div class="pulse-effect"></div>
    </div>
  `,
  iconSize: [51, 51],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
// const getRotatedIcon = (rotation) =>
//   L.divIcon({
//     html: `<img src="https://cdn-icons-png.flaticon.com/512/271/271226.png" style="width:20px; height:20px; transform: rotate(${rotation}deg);" />`,
//     className: '',
//     iconSize: [10, 10],
//     iconAnchor: [10, 10]
//   });
  const getRotatedIcon = (rotation) =>
    L.divIcon({
      html: `<img src="https://cdn-icons-png.flaticon.com/512/271/271226.png" 
             style="width:20px; height:20px; transform: rotate(${rotation}deg)" />`,
      className: '',
      iconSize: [10, 10],
      iconAnchor: [10, 10]
    });
// const calculateBearing = (pointA, pointB) => {
//   const toRad = (deg) => deg * (Math.PI / 180);
//   const lat1 = toRad(pointA[0]);
//   const lon1 = toRad(pointA[1]);
//   const lat2 = toRad(pointB[0]);
//   const lon2 = toRad(pointB[1]);

//   const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
//   const x = Math.cos(lat1) * Math.sin(lat2) - 
//            Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
//   let bearing = Math.atan2(y, x);
//   bearing = bearing * (180 / Math.PI);
//   return (bearing + 360) % 360;
// };
const DEFAULT_POSITION = [17.3850, 78.4867];
const SOCKET_SERVER_URL = 'http://104.251.218.102:8080';

const STIMULATOR = 'http://104.251.218.94:9000';


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

  const [dummyData,setDummyData] = useState({});

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
    const socket2 = io(STIMULATOR, { transports: ['websocket'] });

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
       
        // setSalesman(updatedSalesman);
        // setCoordinates(newCoordinates);
        // setLastUpdated(new Date());

        // pathRef.current = [...pathRef.current, newCoordinates];
        // if (pathRef.current.length % 5 === 0) {
        //    setPath([...pathRef.current]);
        // }
      }
      socket2.on('testing live track', (data) => {
        console.log("😎✅ track Data",data);
        const newDummyCord = [data.latitude, data.longitude];
        setCoordinates(newDummyCord);
        pathRef.current = [...pathRef.current, newDummyCord];
        setPath([...pathRef.current]);
        if (pathRef.current.length % 5 === 0) {
          // setPath([...pathRef.current]);
        }
        setLastUpdated(new Date());
        }
        );
    });

    return () => {
      socket.disconnect();
      socket2.disconnect();
    };
  }, [initialSalesman?.salesmanName, autoFocus]);

  const handleBackToDashboard = () => navigate('/dashboard');

  // Add this new icon configuration above the LiveMap component
  // const ForwardIcon = L.icon({
  //   iconUrl: 'https://cdn-icons-png.flaticon.com/512/271/271226.png', // Use any forward arrow icon
  //   iconSize: [25, 25],
  //   iconAnchor: [12, 12],
  //   className: 'direction-arrow'
  // });
  
  // Add this function above the LiveMap component
  // const calculateBearing = (pointA, pointB) => {
  //   const toRad = deg => deg * (Math.PI / 180);
  //   const lat1 = toRad(pointA[0]);
  //   const lon1 = toRad(pointA[1]);
  //   const lat2 = toRad(pointB[0]);
  //   const lon2 = toRad(pointB[1]);
  
  //   const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  //   const x = Math.cos(lat1) * Math.sin(lat2) - 
  //            Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  //   let bearing = Math.atan2(y, x);
  //   bearing = bearing * (180 / Math.PI);
  //   return (bearing + 360) % 360;
  // };
  const calculateBearing = (prevCoords, newCoords) => {
    const [prevLat, prevLng] = prevCoords;
    const [newLat, newLng] = newCoords;
    const y = Math.sin((newLng - prevLng) * Math.PI / 180) * Math.cos(newLat * Math.PI / 180);
    const x = Math.cos(prevLat * Math.PI / 180) * Math.sin(newLat * Math.PI / 180) -
              Math.sin(prevLat * Math.PI / 180) * Math.cos(newLat * Math.PI / 180) *
              Math.cos((newLng - prevLng) * Math.PI / 180);
    let bearing = Math.atan2(y, x) * 180 / Math.PI;
    return (bearing + 360) % 360;
  };
  
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
          icon={pulsingIcon}
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
        
        {/* {path.map((coord, index) => {
  if ((index + 1) % 1 === 0 && index < path.length - 1) {
    const nextCoord = path[index + 1];
    const bearing = calculateBearing(coord, nextCoord);
    const rotation = bearing - 90; // Adjust for East-facing icon

    return (
      // <RotatedMarker
      //   key={`direction-${index}`}
      //   position={coord}
      //   icon={L.icon({
      //     iconUrl: 'https://cdn-icons-png.flaticon.com/512/271/271226.png',
      //     iconSize: [20, 20],
      //     iconAnchor: [12, 12],
      //     className: `direction-arrow-${index}`
      //   })}
      //   rotationAngle={rotation}
      //   rotationOrigin="center"
      // />
      <Marker
        // key={`direction-${index}`}
        key={`direction-${index}-${coord[0]}-${coord[1]}`}
        position={coord}
        icon={getRotatedIcon(rotation)}
      />
    );
  }
 
})} */}
{path.slice(0, -1).map((coord, index) => {
    const nextCoord = path[index + 1];
    const bearing = calculateBearing(coord, nextCoord);
    const rotation = bearing - 90; // Adjust for East-facing icon

    return (
      <Marker
        key={`direction-${index}-${coord[0]}-${coord[1]}`}
        position={coord}
        icon={getRotatedIcon(rotation)}
      />
    );
  })}
  

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