// //------------------------proper code-----------------
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
import React, { useEffect, useState, useRef,useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './LiveMap.css'
import { useLocation, useNavigate } from 'react-router-dom'
import L from 'leaflet'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { io } from 'socket.io-client'
import ReactLeafletDriftMarker from 'react-leaflet-drift-marker'
import locationIcon from 'src/assets/location.png'
import Cookies from 'js-cookie'
import { FaSatellite } from 'react-icons/fa'
import { createRoot } from 'react-dom/client'
import { FaTasks } from 'react-icons/fa'
import { FaTimes } from 'react-icons/fa'
import {
  TableContainer,
  Paper,
  IconButton,
  Dialog,
  DialogContent,
  Typography,
  Button,
  InputBase,
  Modal,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Autocomplete,
  Chip,
  Tooltip,
} from '@mui/material'
import { Checkbox, FormControlLabel } from '@mui/material'
import axios from 'axios'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import { RiEdit2Fill } from 'react-icons/ri'
import { AiFillDelete } from 'react-icons/ai'
import toast, { Toaster } from 'react-hot-toast'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'
import RoomIcon from '@mui/icons-material/Room'
import { AiOutlinePlus } from 'react-icons/ai'
import myGif from "../../../src/views/base/ReusablecodeforTable/loadergif.gif"
import satimg from "../../../src/assets/images/satimg.svg";
import walkingsal from "../../../public/WalkingSalesman.gif";
function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(!document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return isVisible;
}

const SatelliteLayer = React.memo(() => (
  <TileLayer
    key="satellite"
    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    attribution='© Esri'
  />
));

const StreetLayer = React.memo(() => (
  <TileLayer
    key="street"
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='© OpenStreetMap'
  />
));

const SatelliteToggleControl = React.memo(({ isSatellite, onToggle }) => {
  const map = useMap();
  const controlRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    if (!controlRef.current) {
      const control = L.control({ position: 'topleft' });
      
      control.onAdd = () => {
        const div = L.DomUtil.create('div', 'leaflet-bar satellite-control');
        div.innerHTML = `
          <button class="satellite-toggle-btn">
            <img 
              src="${satimg}" 
              alt="Satellite View" 
              class="satellite-icon ${isSatellite ? 'active' : ''}"
            />
          </button>
        `;
        
        L.DomEvent.on(div, 'click', onToggle);
        return div;
      };

      control.addTo(map);
      controlRef.current = control;
    }

    // Update icon color
    const svg = map.getContainer().querySelector('.satellite-control svg');
    if (svg) {
      svg.setAttribute('stroke', isSatellite ? '#1890ff' : '#000000');
    }

    return () => {
      if (controlRef.current) {
        controlRef.current.remove();
        controlRef.current = null;
      }
    };
  }, [map, isSatellite, onToggle]);

  return null;
});
const sidebarStyles = `
  .task-sidebar {
    position: fixed;
    top: 150px;
    right: -350px;
    width: 350px;
    height: 60%;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
    transition: right 0.3s ease;
    z-index: 1000;
    padding: 20px;
    overflow-y: auto;
  }

  .task-sidebar.open {
    right: 0;
  }

  .sidebar-toggle {
    position: fixed;
    top: 100px;
    right: 20px;
    z-index: 10000;
    background: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }

  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .task-item {
    padding: 10px;
    margin-bottom: 10px;
    background: #f5f5f5;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .task-item:hover {
    background: #e0e0e0;
  }
`

const TaskSidebar = ({ isOpen, onClose, selectedSalesman }) => {
  const [taskData, setTaskData] = useState([])
  const [taskAddModalOpen, setTaskAddModalOpen] = useState(false)
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    taskDescription: '',
    deadline: '',
    address: '',
  })
  const [editTaskData, setEditTaskData] = useState({
    _id: '',
    taskDescription: '',
    deadline: '',
    address: '',
    status: 'Pending',
  })
  const style = {
    position: 'absolute',
    top: '50%',
    borderRadius: '10px',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '35%',
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto', // Enable vertical scrolling
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    marginTop: '8px',
  }
  // Fetch tasks when the sidebar opens or when the selected salesman changes
  useEffect(() => {
    // if (isOpen && selectedSalesman) {
    //   fetchTasks()
    // }
    if (selectedSalesman?._id) {
      fetchTasks()
    }
    // }, [selectedSalesman?._id])
  }, [selectedSalesman?.username])

  const fetchTasks = async () => {
    try {
      const token = Cookies.get('token')
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/task/${selectedSalesman._id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      console.log('Task fetched💕', response.data)
      setTaskData(response.data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  const handleAddTaskBySal = () => {
    setTaskAddModalOpen(true)
  }

  const handleStatusChange = async (item) => {
    try {
      const token = Cookies.get('token')
      const newStatus = item.status === 'Completed' ? 'Pending' : 'Completed' // Toggle status

      // API call to update status
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/task/status/${item._id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )

      if (response.status === 200) {
        toast.success(`Task marked as ${newStatus}`)

        // Update state instantly instead of making an extra GET request
        setTaskData((prevTasks) =>
          prevTasks.map((task) => (task._id === item._id ? { ...task, status: newStatus } : task)),
        )
        fetchTasks() // Refresh the task data
      }
    } catch (error) {
      toast.error('Error updating task status')
      console.error('Task status update error:', error)
    }
  }

  const handleTaskSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = Cookies.get('token')
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/task`,
        {
          ...newTask,
          deadline: new Date(newTask.deadline).toISOString(),
          assignedTo: [selectedSalesman._id],
          companyId: selectedSalesman.companyId,
          branchId: selectedSalesman.branchId,
          supervisorId: selectedSalesman.supervisorId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )

      if (response.status === 201) {
        fetchTasks() // Refresh task data
        setTaskAddModalOpen(false)
        setNewTask({
          taskDescription: '',
          deadline: '',
          address: '',
        })
      }
    } catch (error) {
      console.error('Task creation error:', error)
    }
  }

  const handleEditTask = (task) => {
    setEditTaskData({
      _id: task._id,
      taskDescription: task.taskDescription,
      deadline: task.deadline.split('T')[0],
      address: task.address,
      latitude: task.latitude,
      longitude: task.longitude,
      status: task.status || 'Pending', // Add status from task
    })
    setEditTaskModalOpen(true)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = Cookies.get('token')
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/task/${editTaskData._id}`,
        {
          ...editTaskData,
          deadline: new Date(editTaskData.deadline).toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )

      if (response.status === 200) {
        fetchTasks() // Refresh task data
        setEditTaskModalOpen(false)
      }
    } catch (error) {
      console.error('Task update error:', error)
    }
  }

  const handleTaskDelete = async (taskId) => {
    try {
      const token = Cookies.get('token')
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/task/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTaskData((prev) => prev.filter((t) => t._id !== taskId))
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  return (
    <div className={`task-sidebar ${isOpen ? 'open' : ''}`}>
      <style>{sidebarStyles}</style>
      <div className="sidebar-header">
        <h3>Tasks</h3>
        {/* <button onClick={onClose} className="close-btn">
          <FaTimes />
        </button> */}
      </div>

      <div className="task-list">
        {taskData && taskData.length > 0 ? (
          taskData.map((task) => (
            <div
              key={task._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: '#f1f8fd',
              }}
            >
              <div className="d-flex align-items-center justify-content-between">
                <Typography variant="subtitle1" component="h3">
                  <strong>{task.taskDescription}</strong>
                </Typography>
              </div>
              <Typography variant="body2" color="textSecondary" style={{ marginTop: '5px' }}>
                <strong>Address: </strong>
                {task.address}
              </Typography>
              <Typography variant="body2" color="textSecondary" style={{ marginTop: '5px' }}>
                <strong>Deadline: </strong> {new Date(task.deadline).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="textSecondary" style={{ marginTop: '5px' }}>
                <Chip
                  label={`Status: ${task.status}`}
                  style={{
                    backgroundColor: task.status === 'Completed' ? 'green' : 'red',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                />
              </Typography>
              <div
                className="d-flex align-items-center justify-content-end"
                style={{ gap: '1px', marginTop: '-12%' }}
              >
                <IconButton
                  aria-label="status"
                  className="icon-button icon-button-fab"
                  onClick={() => handleStatusChange(task)}
                  style={{ color: '#FFFFFF', opacity: 1 }}
                >
                  {task.status === 'Completed' ? (
                    <CheckCircleIcon className="icon-button-icon" style={{ color: 'green' }} />
                  ) : (
                    <RadioButtonUncheckedIcon
                      className="icon-button-icon"
                      style={{ color: 'red' }}
                    />
                  )}
                </IconButton>
                <IconButton
                  aria-label="edit"
                  onClick={() => handleEditTask(task)}
                  className="icon-button icon-button-edit"
                >
                  <RiEdit2Fill className="icon-button-icon" />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => handleTaskDelete(task._id)}
                  className="icon-button icon-button-delete"
                >
                  <AiFillDelete className="icon-button-icon" />
                </IconButton>
              </div>
            </div>
          ))
        ) : (
          <Typography style={{ textAlign: 'center' }}>
            <strong> No tasks available to {selectedSalesman.salesmanName}</strong>
          </Typography>
        )}
      </div>

      {/* <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button variant="contained" color="primary" onClick={() => handleAddTaskBySal()}>
          Add Task
        </Button>
      </div> */}
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          backgroundColor: '',
          padding: '1rem',
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleAddTaskBySal()}
          style={{
            borderRadius: '20px',
            boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.2), -4px 4px 10px rgba(0, 0, 0, 0.2)',
          }}
          startIcon={<AiOutlinePlus size={20} />}
        >
          Add Task
        </Button>
      </div>

      {/* Add Task Modal */}
      <Modal
        open={taskAddModalOpen}
        onClose={() => setTaskAddModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              ADD Task
            </Typography>
            <IconButton onClick={() => setTaskAddModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          <form onSubmit={handleTaskSubmit}>
            <TextField
              label="Task Description"
              name="taskDescription"
              value={newTask.taskDescription}
              onChange={(e) => setNewTask({ ...newTask, taskDescription: e.target.value })}
              fullWidth
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FormatListNumberedIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Deadline"
              name="deadline"
              type="date"
              value={newTask.deadline}
              onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccessTimeFilledIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Address"
              name="address"
              value={newTask.address}
              onChange={(e) => setNewTask({ ...newTask, address: e.target.value })}
              fullWidth
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <RoomIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="contained" color="primary" type="submit" style={{ marginTop: '20px' }}>
              Submit
            </Button>
          </form>
        </Box>
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        open={editTaskModalOpen}
        onClose={() => setEditTaskModalOpen(false)}
        aria-labelledby="edit-task-modal"
      >
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Typography variant="h6" component="h2">
              Edit Task
            </Typography>
            <IconButton onClick={() => setEditTaskModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          <form onSubmit={handleEditSubmit}>
            <TextField
              label="Task Description"
              name="taskDescription"
              value={editTaskData.taskDescription}
              onChange={(e) =>
                setEditTaskData({ ...editTaskData, taskDescription: e.target.value })
              }
              fullWidth
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FormatListNumberedIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Deadline"
              name="deadline"
              type="date"
              value={editTaskData.deadline}
              onChange={(e) => setEditTaskData({ ...editTaskData, deadline: e.target.value })}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccessTimeFilledIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Address"
              name="address"
              value={editTaskData.address}
              onChange={(e) => setEditTaskData({ ...editTaskData, address: e.target.value })}
              fullWidth
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <RoomIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                margin: 'normal',
                mt: 2,
                mb: 2,
                border: '1px solid rgba(0, 0, 0, 0.23)',
                borderRadius: '4px',
                padding: '16.5px 14px',
              }}
            >
              <InputAdornment position="start" sx={{ mr: 1 }}>
                <CheckCircleIcon />
              </InputAdornment>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editTaskData.status === 'Completed'}
                    onChange={(e) =>
                      setEditTaskData({
                        ...editTaskData,
                        status: e.target.checked ? 'Completed' : 'Pending',
                      })
                    }
                    color="primary"
                  />
                }
                label="Completed"
                sx={{ margin: 0 }}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button variant="contained" color="primary" type="submit" sx={{ width: '50%' }}>
                Update Task
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </div>
  )
}

const DefaultIcon = L.icon({
  iconUrl: locationIcon,
  shadowUrl: markerShadow,
  iconSize: [51, 51],
  // iconAnchor: [12, 41],
  iconAnchor: [25.5, 51],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})
const pulsingIcon = L.divIcon({
  className: '', // Leave empty to avoid default styles
  html: `
    <div class="marker-container">
      <img class="marker-icon" src="${locationIcon}" alt="marker icon" style="width:51px; height:51px; ">
      <div class="pulse-effect"></div>
    </div>
  `,
  iconSize: [51, 51],
  iconAnchor: [25.5, 51],
  popupAnchor: [1, -34],
})
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
             style="width:10px; height:10px; transform: rotate(${rotation}deg)" />`,
    className: '',
    iconSize: [5, 5],
    iconAnchor: [5, 5],
  })
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
const DEFAULT_POSITION = [21.129125, 79.104877]
// const SOCKET_SERVER_URL = 'http://104.251.218.102:8080'
const SOCKET_SERVER_URL = import.meta.env.VITE_SERVER_URL;

const STIMULATOR = 'http://104.251.218.94:9000'

// Animation Controller Component
// const MapController = ({
//   coordinates,
//   previousPosition,
//   polylineRef,
//   autoFocus,
//   setMarkerPosition,
// }) => {
//   const map = useMap()
//   const animationRef = useRef(null)

//   // Easing function: easeInOutQuad
//   const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)

//   useEffect(() => {
//     if (coordinates && map && autoFocus) {
//       const targetPosition = coordinates

//       if (previousPosition.current) {
//         const duration = 9500 // 2 seconds animation
//         let startTime

//         const animateMarker = (timestamp) => {
//           if (!startTime) startTime = timestamp
//           const elapsedTime = timestamp - startTime
//           const progress = Math.min(elapsedTime / duration, 1)
//           const easedProgress = easeInOutQuad(progress)

//           // Calculate intermediate position
//           const newLat =
//             previousPosition.current[0] +
//             (coordinates[0] - previousPosition.current[0]) * easedProgress
//           const newLng =
//             previousPosition.current[1] +
//             (coordinates[1] - previousPosition.current[1]) * easedProgress

//           // Update polyline
//           if (polylineRef.current) {
//             const currentPath = polylineRef.current.getLatLngs()
//             currentPath.push([newLat, newLng])
//             polylineRef.current.setLatLngs(currentPath)
//             setMarkerPosition([newLat, newLng])
//           }
//           setMarkerPosition([newLat, newLng])

//           // Update map view
//           map.setView([newLat, newLng], map.getZoom(), { animate: true })

//           if (progress < 1) {
//             animationRef.current = requestAnimationFrame(animateMarker)
//           } else {
//             previousPosition.current = coordinates
//           }
//         }

//         animationRef.current = requestAnimationFrame(animateMarker)

//         return () => {
//           if (animationRef.current) {
//             cancelAnimationFrame(animationRef.current)
//           }
//         }
//       } else {
//         previousPosition.current = coordinates
//       }
//     }
//   }, [coordinates, map, autoFocus])

//   return null
// }
const MapController = ({
  coordinates,
  polylineRef,
  autoFocus,
  setMarkerPosition,
  setIsLoading
}) => {
  const map = useMap();
  const animationRef = useRef(null);
  const markerPositionRef = useRef(coordinates);
  const startTimeRef = useRef(null);
  const targetPositionRef = useRef(coordinates);
  const initialPositionRef = useRef(coordinates);
  
  const isValidCoordinate = (lat, lng) => {
    return !isNaN(lat) && !isNaN(lng) && typeof lat === 'number' && typeof lng === 'number';
  };
  // const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
  const easeInOutQuad = (t) => t;

  const animate = (timestamp) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / 10000, 1);
    const eased = easeInOutQuad(progress);

      //guess intermediate lat long for smoothness
    const currentLat = initialPositionRef.current[0] + 
      (targetPositionRef.current[0] - initialPositionRef.current[0]) * eased;
    const currentLng = initialPositionRef.current[1] + 
      (targetPositionRef.current[1] - initialPositionRef.current[1]) * eased;
        
      if (!isValidCoordinate(currentLat, currentLng)) {
        console.error('Invalid intermediate coordinates:', currentLat, currentLng);
        setIsLoading(true); 
        return;
      }else{
        setIsLoading(false); 
      }
    
    
    // Update marker position and ref
    const newPos = [currentLat, currentLng];
    setMarkerPosition(newPos);
    markerPositionRef.current = newPos;

    // Update polyline
    if (polylineRef.current) {
      const currentPath = polylineRef.current.getLatLngs();
      currentPath.push(newPos);
      polylineRef.current.setLatLngs(currentPath);
    }

    // Update map view
    if (autoFocus) {
      map.setView(newPos, map.getZoom(), { animate: true });
    }

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      // Final position update
      initialPositionRef.current = targetPositionRef.current;
      markerPositionRef.current = targetPositionRef.current;
    }
  };

  useEffect(() => {
    if (!coordinates || !map) return;

    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Update target position and reset animation state
    targetPositionRef.current = coordinates;
    initialPositionRef.current = markerPositionRef.current;
    startTimeRef.current = null;

    // Start new animation
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [coordinates, map, autoFocus]);

  return null;
};


const LiveMap = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { salesman: initialSalesman } = location.state || {}
  
  const initialCoordinates = initialSalesman?.latitude && initialSalesman?.longitude
    ? [initialSalesman.latitude, initialSalesman.longitude]
    : DEFAULT_POSITION;
  const [salesman, setSalesman] = useState(initialSalesman)
  const [coordinates, setCoordinates] = useState(initialCoordinates)
  const [path, setPath] = useState([])
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [autoFocus, setAutoFocus] = useState(true)

  const mapRef = useRef(null)
  const previousPosition = useRef(coordinates)
  const polylineRef = useRef(null)
  const pathRef = useRef([])
  const [showSidebar, setShowSidebar] = useState(false)
  const [markerPosition, setMarkerPosition] = useState(coordinates)
  // Just after your other useState calls
  const [satelliteView, setSatelliteView] = useState(false)

  const handleSatelliteToggle = useCallback(() => {
    setSatelliteView(prev => !prev);
  }, []);





  const isValidCoordinate = (lat, lng) => {
    return !isNaN(lat) && !isNaN(lng) && typeof lat === "number" && typeof lng === "number";
  };
  const initialHasData = initialSalesman?.latitude && initialSalesman?.longitude && 
  isValidCoordinate(initialSalesman.latitude, initialSalesman.longitude);
  const [hasReceivedData, setHasReceivedData] = useState(initialHasData);
  const [isLoading,setIsLoading] = useState(false);
  //  const isTabVisible = usePageVisibility(); 
   
  
  
  
  const calculateDistance = (coord1, coord2) => {
    const [lat1, lon1] = coord1
    const [lat2, lon2] = coord2
    const R = 6371000 // Earth radius in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }
  const [dummyData, setDummyData] = useState({})
  const SidebarToggleButton = () => {
    const map = useMap()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
      if (!map) return

      const container = L.DomUtil.create('div', 'sidebar-toggle-container')
      const button = L.DomUtil.create('button', 'sidebar-toggle', container)
      button.innerHTML = '<FaTasks size={20} />'

      L.DomEvent.on(button, 'click', (e) => {
        L.DomEvent.stop(e)
        setShowSidebar((prev) => !prev)
      })

      map.getContainer().appendChild(container)
      setIsMounted(true)

      return () => {
        map.getContainer().removeChild(container)
      }
    }, [map])

    return null
  }
  useEffect(() => {
    if (initialSalesman?.latitude && initialSalesman?.longitude) {
      const newCoordinates = [Number(initialSalesman.latitude), Number(initialSalesman.longitude)]
      setCoordinates(newCoordinates)
      pathRef.current = [newCoordinates]
      setPath(pathRef.current)
      previousPosition.current = newCoordinates
    }
  }, [initialSalesman])

  useEffect(() => {
    if (!initialSalesman?.salesmanName) return

    const socket = io(SOCKET_SERVER_URL, { transports: ['websocket'] })
    const socket2 = io(STIMULATOR, { transports: ['websocket'] })
    const token = Cookies.get('token')
    socket.emit('authenticate', token)
    socket.on('connect', () => {
      console.log('✅Connected to tracking server')
      socket.emit('requestSalesmanTracking', initialSalesman.username)
      // socket.emit("requestSalesmanHistory", initialSalesman.username );
    })
    // socket.on('liveSalesmanData', (data) => {
    //   const updatedSalesman = data.find(
    //     s => String(s.username).trim().toLowerCase() ===
    //          String(initialSalesman.username).trim().toLowerCase()
    //   );
    //      console.log("😎✅ track Data",data);
    //     // console.log(data)
    //   if (updatedSalesman) {
    //     const newCoordinates = [
    //       Number(updatedSalesman.latitude),
    //       Number(updatedSalesman.longitude)
    //     ];

    //     setSalesman(updatedSalesman);
    //     setCoordinates(newCoordinates);
    //     setLastUpdated(new Date());

    //     pathRef.current = [...pathRef.current, newCoordinates];
    //     if (pathRef.current.length % 5 === 0) {
    //        setPath([...pathRef.current]);
    //     }
    //   }
    //   socket2.on('testing live track', (data) => {
    //     console.log("😎✅ track Data",data);
    //     const newDummyCord = [data.latitude, data.longitude];
    //     setCoordinates(newDummyCord);
    //     pathRef.current = [...pathRef.current, newDummyCord];
    //     setPath([...pathRef.current]);
    //     if (pathRef.current.length % 5 === 0) {
    //       setPath([...pathRef.current]);
    //     }
    //     setLastUpdated(new Date());
    //     }
    //     );
    // });
    // socket.on('connect', () => {
    //   console.log('Connected to tracking server')
    //   // socket.emit('requestSalesmanTracking', initialSalesman.username)
    //   socket.emit("requestSalesmanHistory", initialSalesman.username );

    // })
    socket.on('salesmanTrackingData', (data) => {
      // //stimulator comment
      // socket.on('salesmanHistoryData', (data) => {
      if (!data) return

      const newCoordinates = [Number(data.latitude), Number(data.longitude)]
      if (!isValidCoordinate(...newCoordinates)) {
        console.error('Invalid Coordinates:', newCoordinates);
        return;
      }else{
        // setIsLoading(false);
      }
      const isFirstData = !hasReceivedData;
      console.log('😎✅ Valid Coordinates');
      console.log('😎✅ single track Data', data);
      // Update stat>e with new data
      // setHasReceivedData(true);
      setTimeout(() => {
        setHasReceivedData(true);
      }, 10000);

      setSalesman(data)
      setCoordinates(newCoordinates)
      setLastUpdated(new Date())

      // Update path history
      //? pathRef.current = [...pathRef.current, newCoordinates]
      // if (pathRef.current.length % 5 === 0) {
      // setPath([...pathRef.current])
      // }
      // Reset animation history for first data point
      if (isFirstData) {
        previousPosition.current = newCoordinates;
        pathRef.current = [newCoordinates];
        setPath([newCoordinates]);
        setMarkerPosition(newCoordinates);
        if (mapRef.current) mapRef.current.setView(newCoordinates);
      } else {
        pathRef.current = [...pathRef.current, newCoordinates];
      }
    })
    // Handle socket errors
    socket.on('connect_error', (err) => {
      console.error('Connection error:', err)
    })

    return () => {
      socket.off('salesmanTrackingData')
      socket.disconnect()
      socket2.disconnect()
    }
  }, [initialSalesman?.username, autoFocus])

  const handleBackToDashboard = () => navigate('/dashboard')

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
    const [prevLat, prevLng] = prevCoords
    const [newLat, newLng] = newCoords
    const y = Math.sin(((newLng - prevLng) * Math.PI) / 180) * Math.cos((newLat * Math.PI) / 180)
    const x =
      Math.cos((prevLat * Math.PI) / 180) * Math.sin((newLat * Math.PI) / 180) -
      Math.sin((prevLat * Math.PI) / 180) *
        Math.cos((newLat * Math.PI) / 180) *
        Math.cos(((newLng - prevLng) * Math.PI) / 180)
    let bearing = (Math.atan2(y, x) * 180) / Math.PI
    return (bearing + 360) % 360
  }

  if (!coordinates || !isValidCoordinate(coordinates[0], coordinates[1])) {
    return <p>No data available. Ensure the salesman is being tracked.</p>;
  }
  return (
    <div className="live-map-container">
      {isLoading && (
        <div className="data-warning-overlay">
          <h2><strong>Loading...</strong></h2>
          <p><strong>please ensure the person you want to track has enabled the location ! </strong></p>
          <img src={myGif} alt="Loading..." style={{width: '100px'}} />
        </div>
      )}
       {!hasReceivedData && (
        <div className="data-warning-overlay">
          <h2><strong>No data available. Ensure salesman tracking is enabled.</strong></h2>
          <p><strong>please ensure the person you want to track has enabled the location ! </strong></p>
          <img src={myGif} alt="Loading..." style={{width: '100px'}} />
        </div>
      )}
      <TaskSidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        selectedSalesman={salesman}
      />
      <div className="header-container">
        <h4>{salesman?.salesmanName || 'Default Location'}</h4>
        <button className="back-button" onClick={handleBackToDashboard}>
          Back To Dashboard
        </button>
        <button
          className="back-button"
          onClick={() => setAutoFocus((prev) => !prev)}
          style={{ backgroundColor: autoFocus ? 'green' : 'red' }}
        >
          {autoFocus ? 'Auto-Focus: ON' : 'Auto-Focus: OFF'}
        </button>

        {/* <button
          className="toggle-button"
          onClick={() => setAutoFocus((prev) => !prev)}
          style={{ backgroundColor: autoFocus ? 'green' : 'red' }}
        >
          {autoFocus ? 'Auto-Focus: ON' : 'Auto-Focus: OFF'}
        </button> */}
      </div>

      <MapContainer center={coordinates} zoom={13} className="map-container" ref={mapRef}>
      <SatelliteToggleControl 
          isSatellite={satelliteView}
          onToggle={handleSatelliteToggle}
        />

        {satelliteView ? <SatelliteLayer /> : <StreetLayer />}

        {/* Conditionally show either the OSM tile or the Satellite tile */}
        {satelliteView ? (
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='© Esri'
        />
      ) : (
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap'
        />
      )}
        {/* <MemoTileLayer
         key={satelliteView ? "satellite" : "street"} // Forces clean remount
          url={
            satelliteView
              ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
              : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
          attribution={
            satelliteView
              ? '© Esri'
              : '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          }
        /> */}
        {/* <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        /> */}

        <ReactLeafletDriftMarker position={markerPosition} icon={pulsingIcon} duration={1}>
          <Popup>
            <div className="popup-content">
              {/* <h4>{salesman?.salesmanName}</h4>
              <p>Latitude: {coordinates[0]?.toFixed(6)}</p>
              <p>Longitude: {coordinates[1]?.toFixed(6)}</p>
              <p>Speed: {salesman?.speed}</p>
              <p>Battery: {salesman?.batteryLevel}</p>
              <p>Network: {salesman?.mobileNetwork}</p>
              <p>Last updated: {lastUpdated.toLocaleTimeString()}</p> */}
              {isNaN(coordinates[0]) || isNaN(coordinates[1]) ? (
  <p>No data available. Please ensure the salesman is being tracked.</p>
) : (
  <>
    <h4>{salesman?.salesmanName}</h4>
    <p>Latitude: {coordinates[0]?.toFixed(6)}</p>
    <p>Longitude: {coordinates[1]?.toFixed(6)}</p>
    <p>Speed: {salesman?.speed}</p>
    <p>Battery: {salesman?.batteryLevel}</p>
    <p>Network: {salesman?.mobileNetwork}</p>
    <p>Last updated: {lastUpdated.toLocaleTimeString()}</p>
  </>
)}

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
          smoothFactor={1}
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
        {/* {path.slice(0, -1).map((coord, index) => {
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
  })} */}

        {/* {(() => {
          let lastMarkerPosition = null
          return path.slice(0, -1).map((coord, index) => {
            // Check if we already have a marker and if the current one is less than 5 meters away
            if (lastMarkerPosition) {
              const distance = calculateDistance(lastMarkerPosition, coord)
              if (distance < 100) {
                //distance to remove redudent marker
                return null // Skip drawing this marker
              }
            }
            // Update the last marker position to the current coordinate
            lastMarkerPosition = coord

            // Calculate the bearing/rotation for the marker icon
            const nextCoord = path[index + 1]
            const bearing = calculateBearing(coord, nextCoord)
            const rotation = bearing - 90 // Adjust for East-facing icon

            return (
              <Marker
                key={`direction-${index}-${coord[0]}-${coord[1]}`}
                position={coord}
                icon={getRotatedIcon(rotation)}
              />
            )
          })
        })()}  */}
          {(() => {
        let lastMarkerPosition = null;
        // Use the current polyline path from the ref
        return pathRef.current.slice(0, -2).map((coord, index) => {
          // Skip marker if too close to the last marker
          if (lastMarkerPosition) {
            const distance = calculateDistance(lastMarkerPosition, coord);
            if (distance < 100) { // 100 meters threshold
              return null;
            }
          }
          // Update last marker position
          lastMarkerPosition = coord;

          // Calculate rotation based on bearing between current and next coordinates
          const nextCoord = pathRef.current[index + 1];
          const bearing = calculateBearing(coord, nextCoord);
          const rotation = bearing - 90; // Adjust for East-facing icon

          return (
            <Marker
              key={`direction-${index}-${coord[0]}-${coord[1]}`}
              position={coord}
              icon={getRotatedIcon(rotation)}
            />
          );
        });
      })()}
        <MapController
          coordinates={coordinates}
          // previousPosition={previousPosition}
          polylineRef={polylineRef}
          autoFocus={autoFocus}
          setMarkerPosition={setMarkerPosition}
          setIsLoading={setIsLoading}
        />
      </MapContainer>
      <button className="sidebar-toggle" onClick={() => setShowSidebar(!showSidebar)}>
        {showSidebar ? <FaTimes size={20} /> : <FaTasks size={20} />}
      </button>
    </div>
  )
}

export default LiveMap
