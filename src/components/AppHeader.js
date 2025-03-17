// import React, { useEffect, useRef } from 'react'
// import { NavLink } from 'react-router-dom'
// import { useSelector, useDispatch } from 'react-redux'
// import {
//   CContainer,
//   CDropdown,
//   CDropdownItem,
//   CDropdownMenu,
//   CDropdownToggle,
//   CHeader,
//   CHeaderNav,
//   CHeaderToggler,
//   CNavLink,
//   CNavItem,
//   useColorModes,
// } from '@coreui/react'
// import CIcon from '@coreui/icons-react'
// import {
//   cilBell,
//   cilContrast,
//   cilEnvelopeOpen,
//   cilList,
//   cilMenu,
//   cilMoon,
//   cilSun,
// } from '@coreui/icons'

// import { AppBreadcrumb } from './index'
// import { AppHeaderDropdown } from './header/index'

// const AppHeader = () => {
//   const headerRef = useRef()
//   const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

//   const dispatch = useDispatch()
//   const sidebarShow = useSelector((state) => state.sidebarShow)

//   useEffect(() => {
//     document.addEventListener('scroll', () => {
//       headerRef.current &&
//         headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
//     })
//   }, [])

//   return (
//     <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
//       <CContainer className="border-bottom px-4" fluid>
//         <CHeaderToggler
//           onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
//           style={{ marginInlineStart: '-14px' }}
//         >
//           <CIcon icon={cilMenu} size="lg" />
//         </CHeaderToggler>
//         <CHeaderNav className="d-none d-md-flex">
//           <CNavItem>
//             <CNavLink to="/dashboard" as={NavLink}>
//               Dashboard
//             </CNavLink>
//           </CNavItem>
//         </CHeaderNav>
//         <CHeaderNav className="ms-auto">
//           <CNavItem>
//             <CNavLink href="#">
//               <CIcon icon={cilBell} size="lg" />
//             </CNavLink>
//           </CNavItem>
//           {/* <CNavItem>
//             <CNavLink href="#">
//               <CIcon icon={cilList} size="lg" />
//             </CNavLink>
//           </CNavItem>
//           <CNavItem>
//             <CNavLink href="#">
//               <CIcon icon={cilEnvelopeOpen} size="lg" />
//             </CNavLink>
//           </CNavItem> */}
//         </CHeaderNav>
//         <CHeaderNav>
//           <li className="nav-item py-1">
//             <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
//           </li>
//           <CDropdown variant="nav-item" placement="bottom-end">
//             <CDropdownToggle caret={false}>
//               {colorMode === 'dark' ? (
//                 <CIcon icon={cilMoon} size="lg" />
//               ) : colorMode === 'auto' ? (
//                 <CIcon icon={cilContrast} size="lg" />
//               ) : (
//                 <CIcon icon={cilSun} size="lg" />
//               )}
//             </CDropdownToggle>
//             <CDropdownMenu>
//               <CDropdownItem
//                 active={colorMode === 'light'}
//                 className="d-flex align-items-center"
//                 as="button"
//                 type="button"
//                 onClick={() => setColorMode('light')}
//               >
//                 <CIcon className="me-2" icon={cilSun} size="lg" /> Light
//               </CDropdownItem>
//               <CDropdownItem
//                 active={colorMode === 'dark'}
//                 className="d-flex align-items-center"
//                 as="button"
//                 type="button"
//                 onClick={() => setColorMode('dark')}
//               >
//                 <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
//               </CDropdownItem>
//               <CDropdownItem
//                 active={colorMode === 'auto'}
//                 className="d-flex align-items-center"
//                 as="button"
//                 type="button"
//                 onClick={() => setColorMode('auto')}
//               >
//                 <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
//               </CDropdownItem>
//             </CDropdownMenu>
//           </CDropdown>
//           <li className="nav-item py-1">
//             <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
//           </li>
//           <AppHeaderDropdown />
//         </CHeaderNav>
//       </CContainer>
//       <CContainer className="px-4" fluid>
//         <AppBreadcrumb />
//       </CContainer>
//     </CHeader>
//   )
// }

// export default AppHeader


import React, { useEffect, useRef,useState } from 'react'
import { NavLink,useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'
import { setToggleSidebar } from '../feature/navSlice'
import { FaVolumeUp, FaVolumeMute, FaAddressCard, FaChartBar, FaCog, FaHome } from 'react-icons/fa'
import { RiVolumeUpFill } from "react-icons/ri";
import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { cilHome, cilUser, cilChartLine, cilBasket, cilClipboard } from '@coreui/icons';
import { TbReportSearch } from 'react-icons/tb'
import { AiOutlineShoppingCart } from "react-icons/ai";
import { requestNotificationPermission, setOnNotificationReceivedCallback } from "../firebase/firebase-config";
import { Tooltip,Box,Badge, Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Divider, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteIcon from '@mui/icons-material/Delete';
const audio = new Audio('../../../notificationsount.wav');

const AppHeader = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadCount1, setUnreadCount1] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null); // For MUI dropdown
  const [soundEnabled, setSoundEnabled] = useState(true);
    // Toggle sound function
    const toggleSound = () => {
      setSoundEnabled((prev) => !prev);
    };
  const open = Boolean(anchorEl);
   // Handle notification click to open dropdown
   const handleNotificationClick = (event) => {
    requestNotificationPermission();

    setAnchorEl(event.currentTarget);
    // setUnreadCount1(unreadCount);
    // setUnreadCount(0); 

  };
  const handleMarkAsRead = () => {
    setUnreadCount(0);
  };
  // Close dropdown
  const handleClose = () => {
    setAnchorEl(null);
    setUnreadCount(0); 

  };

  // Clear all notifications
  const handleClearAll = () => {
    console.log("Before clearing:", notifications); // Debug log
  
    setNotifications([]); // Clear notifications
    setUnreadCount(0); // Reset unread count
    // setAnchorEl(null); // Close the dropdown
  
    console.log("After clearing:", notifications); // Debug log
  };
  useEffect(() => {
    // Set up the callback for new notifications
    setOnNotificationReceivedCallback((newNotification) => {
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      setUnreadCount1((prev) => prev + 1);
      if (soundEnabled) {
        audio.play();
      }

    });

    return () => {
      // Cleanup callback when component unmounts
      setOnNotificationReceivedCallback(null);
    };
  }, [soundEnabled]);
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebar.sidebarShow)
  const toggle = useSelector((state) => state.navbar)
  console.log(toggle, "nave baajdasjdjasdkjashd");
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])
  
  const location = useLocation()

  // Check if the current page is the dashboard
  const isDashboard = location.pathname === '/dashboard'

  const openSidebar = () => {
    dispatch({ type: 'set', sidebarShow: true });
  };
  const handleHome = () => {
    dispatch({ type: 'set', sidebarShow: true });
    dispatch(setToggleSidebar({ home: true, management: false, manageAttendance: false, manageOrder: false, reportManagement: false }));
    if (toggle.home) {
      dispatch({ type: 'set', sidebarShow: !sidebarShow });
    }
  };
  
  const handleMaster = () => {
    dispatch({ type: 'set', sidebarShow: true });
    dispatch(setToggleSidebar({ home: false, management: true, manageAttendance: false, manageOrder: false, reportManagement: false }));
    if (toggle.management) {
      dispatch({ type: 'set', sidebarShow: !sidebarShow });
    }
  };
  
  const handleReports = () => {
    dispatch({ type: 'set', sidebarShow: true });
    dispatch(setToggleSidebar({ home: false, management: false, manageAttendance: true, manageOrder: false, reportManagement: false }));
    if (toggle.manageAttendance) {
      dispatch({ type: 'set', sidebarShow: !sidebarShow });
    }
  };
  
  const handleOrder = () => {
    dispatch({ type: 'set', sidebarShow: true });
    dispatch(setToggleSidebar({ home: false, management: false, manageAttendance: false, manageOrder: true, reportManagement: false }));
    if (toggle.manageOrder) {
      dispatch({ type: 'set', sidebarShow: !sidebarShow });
    }
  };
  
  const handleReportManagement = () => {
    dispatch({ type: 'set', sidebarShow: true });
    dispatch(setToggleSidebar({ home: false, management: false, manageAttendance: false, manageOrder: false, reportManagement: true }));
    if (toggle.reportManagement) {
      dispatch({ type: 'set', sidebarShow: !sidebarShow });
    }
  };
  
  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
    {/* Header Container */}
    <CContainer className="border-bottom px-4" fluid style={{ backgroundColor: "#212631", color: "white" }}>
      
      {/* Header Toggler for Sidebar */}
      <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-30px' }}
        >
          {/* <CIcon icon={cilMenu} size="lg" /> */}
        </CHeaderToggler>
  
      {/* Navigation Section */}
      <div className="d-flex justify-content-between align-items-center" style={{ padding: "10px 20px" }}>
        
        {/* Left Navigation */}
        <CHeaderNav className="d-none d-md-flex flex-grow-1">
          <CNavItem className="d-flex">
          <CHeaderNav className="ms-auto">
          <CHeaderNav className="ms-auto">
          <button className="nav-btn"  onClick={() => handleHome()}>
            <FaHome className="nav-icon" /> Home
          </button>
        </CHeaderNav>

        <CHeaderNav className="ms-auto">
          <button className="nav-btn" onClick={() => handleMaster()}>
            <FaAddressCard className="nav-icon" /> Management
          </button>
        </CHeaderNav>

        <CHeaderNav className="ms-auto">
          <button className="nav-btn" onClick={() => handleReports()}>
            <FaChartBar className="nav-icon" /> Manage Attendance
          </button>
        </CHeaderNav>

        <CHeaderNav className="ms-auto">
        
            <button className="nav-btn" onClick={() => handleOrder()}>
              <AiOutlineShoppingCart className="nav-icon" /> Manage order
            </button>
        
        </CHeaderNav>
        <CHeaderNav className="ms-auto">
        
        <button className="nav-btn" onClick={() => handleReportManagement()}>
          <TbReportSearch className="nav-icon" /> Report Management
        </button>
    
    </CHeaderNav>
  {/* <CNavLink
    to="/dashboard"
    as={NavLink}
    style={{ color: 'white' }}
    className="mx-3"
    onClick={() => handleHome()}
  >
    <CIcon icon={cilHome} className="me-2" /> Home
  </CNavLink> */}
</CHeaderNav>
<style jsx>{`
  .nav-btn {
    padding: 10px 20px; /* Padding for the button */
    margin: 0 10px; /* Margin between buttons */
    background-color: #212631; /* Light white background color */
    color: white; /* Dark gray text color */
    border: none; /* Light border color */
    border-radius: 5px; /* Rounded corners */
    font-size: 16px; /* Font size */
    cursor: pointer; /* Pointer cursor on hover */
    transition: background-color 0.3s ease, transform 0.2s ease, border-color 0.3s ease; /* Smooth transition */
    display: flex;
    align-items: center; /* Align icon and text */
    justify-content: center; /* Center the content */
  }

  .nav-btn .nav-icon {
    margin-right: 20px; /* Space between icon and text */
    font-size: 18px; /* Icon size */
  }

  .nav-btn:hover {
    background-color: #212631; /* Light gray background on hover */
    border-color: #ccc; /* Darker border color on hover */
    transform: scale(1.05); /* Slight scaling effect on hover */
  }

  .nav-btn:focus {
    outline: none; /* Remove focus outline */
  }

  .nav-btn:active {
    transform: scale(0.98); /* Slight shrink effect when active */
  }
`}</style>
{/* <CHeaderNav className="ms-auto">
  <CNavLink
    to="/Management"
    as={NavLink}
    style={{ color: 'white' }}
    className="mx-3"
    onClick={() => handleMaster()}
  >
    <CIcon icon={cilUser} className="me-2" /> Management
  </CNavLink>
</CHeaderNav>

<CHeaderNav className="ms-auto">
  <CNavLink
    to="/analytics"
    as={NavLink}
    style={{ color: 'white' }}
    className="mx-3"
    onClick={() => handleReports()}
  >
    <CIcon icon={cilChartLine} className="me-2" /> Manage Attendance
  </CNavLink>
</CHeaderNav>

<CHeaderNav className="ms-auto">
  <CNavLink
    to="/settings"
    as={NavLink}
    style={{ color: 'white' }}
    className="mx-3"
    onClick={() => handleOrder()}
  >
    <CIcon icon={cilBasket} className="me-2" /> Manage Order
  </CNavLink>
</CHeaderNav>

<CHeaderNav className="ms-auto">
  <CNavLink
    to="/reports"
    as={NavLink}
    style={{ color: 'white' }}
    className="mx-3"
    onClick={() => handleReportManagement()}
  >
    <CIcon icon={cilClipboard} className="me-2" /> Report Management
  </CNavLink>
</CHeaderNav> */}

          </CNavItem>
        </CHeaderNav>
  
        {/* Right Section with Notifications, Theme Selector, and User Dropdown */}
    
      </div>
      
      <CHeaderNav className=" d-flex align-items-center">
      
     {/* Notification Icon with MUI Dropdown */}
     <IconButton
            aria-label="notifications"
            onClick={handleNotificationClick}
            style={{ color: 'white' }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* MUI Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              style: {
                width: '350px',
                maxHeight: '400px',
                overflowY: 'auto',
              },
            }}
          >
            {/* Dropdown Header */}
            <MenuItem >
              <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                Notifications
              </Typography>
              {/* {notifications.length > 0 && ( */}
              {/* <IconButton
            // aria-label="toggle sound"
            onClick={toggleSound}
            style={{marginLeft: 'auto'}}
          >
            {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
          </IconButton>
                  <IconButton
                  size="small"
                  style={{ marginLeft: 'auto' }}
                > 
                  <DeleteIcon fontSize="small" onClick={handleClearAll}/>
                </IconButton> */}
                <Box style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                <Tooltip title={soundEnabled ? "Mute Notifications" : "Unmute Notifications"}>
    <IconButton onClick={toggleSound}>
      {soundEnabled ? <RiVolumeUpFill /> : <FaVolumeMute />}
    </IconButton>
    </Tooltip>
    <Tooltip title="Clear All Notifications">
    <IconButton size="small" onClick={handleClearAll}>
      <DeleteIcon fontSize="small" />
    </IconButton>
    </Tooltip>
  </Box>
              {/* // )} */}
            </MenuItem>
            <Divider />

            {/* Notifications List */}
            {notifications.length === 0 ? (
              <MenuItem disabled>
                <Typography variant="body2" color="textSecondary">
                  No new notifications
                </Typography>
              </MenuItem>
            ) : (
              notifications.map((notification, index) => (
                <MenuItem key={index}
                 onClick={handleClose}
                 style={anchorEl && index < unreadCount ? { backgroundColor: '#eef6fd' } : {}}
                 >
                  {/* <ListItemIcon>
                    <NotificationsIcon fontSize="small" />
                  </ListItemIcon> */}
                  <ListItemText
                    primary={notification.notification.title}
                    secondary={notification.notification.body}
                  />
                  {/* <Typography variant="caption" color="textSecondary">
                    {new Date().toLocaleTimeString()}
                  </Typography> */}
                </MenuItem>
              ))
            )}
          </Menu>
          
          {/* Notifications */}
          {/* <CNavItem>
            <CNavLink href="#" style={{ color: "white" }}>
              <CIcon onClick={requestNotificationPermission} icon={cilBell} size="lg" />
            </CNavLink>
          </CNavItem> */}
  
          {/* Divider */}
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
  
          {/* Theme Toggle Dropdown */}
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === "dark" ? (
                <CIcon icon={cilMoon} size="lg" style={{ color: "white" }} />
              ) : colorMode === "auto" ? (
                <CIcon icon={cilContrast} size="lg" style={{ color: "white" }} />
              ) : (
                <CIcon icon={cilSun} size="lg" style={{ color: "white" }} />
              )}
            </CDropdownToggle>
             {/* Sound Toggle Button */}
          
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === "light"}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode("light")}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" style={{ color: "white" }} /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === "dark"}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode("dark")}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" style={{ color: "white" }} /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === "auto"}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode("auto")}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" style={{ color: "white" }} /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
  
          {/* Divider */}
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
  
          {/* User Dropdown */}
          <AppHeaderDropdown />
        </CHeaderNav>
    </CContainer>
  
    {/* Breadcrumb */}
    {/* <CContainer className="px-4" fluid>
      <AppBreadcrumb />
    </CContainer> */}
  </CHeader>
  
  
  
  )
}

export default AppHeader

