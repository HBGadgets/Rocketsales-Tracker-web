import React, { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { CNavItem, CNavTitle } from '@coreui/react';
import Cookies from 'js-cookie';
import { FaUsers, FaBuilding, FaLayerGroup, FaUserTie, FaClipboardList, FaMapMarker } from 'react-icons/fa';

const ManagementExport = () => {
  const [role, setRole] = useState(null); // Set initial state to null
  const [managementItems, setManagementItems] = useState([]); // State to hold dynamic menu items
  const token = Cookies.get('token'); // Get the token from cookies

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the token
        setRole(decodedToken.role); // Set the role in state
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, [token]); // Only run this effect when the token changes

  useEffect(() => {
    if (role !== null) {
      let items = [];
      if (role == 1) {
        items = [
          { component: CNavItem, name: 'Task Management', to: '/task-management', icon: <FaClipboardList /> },
          { component: CNavItem, name: 'User Management', to: '/user-management', icon: <FaUsers /> },
          { component: CNavItem, name: 'Company', to: '/Company', icon: <FaBuilding /> },
          { component: CNavItem, name: 'Branch Group', to: '/Branch-Group', icon: <FaLayerGroup /> },
          { component: CNavItem, name: 'Branches', to: '/Branches', icon: <FaMapMarker /> },
          { component: CNavItem, name: 'Supervisor', to: '/Supervisor', icon: <FaUserTie /> },
        ];
      } else if (role == 2) {
        items = [
          { component: CNavItem, name: 'Task Management', to: '/task-management', icon: <FaClipboardList /> },
          { component: CNavItem, name: 'User Management', to: '/user-management', icon: <FaUsers /> },
          { component: CNavItem, name: 'Branch Group', to: '/Branch-Group', icon: <FaLayerGroup /> },
          { component: CNavItem, name: 'Branches', to: '/Branches', icon: <FaMapMarker /> },
          { component: CNavItem, name: 'Supervisor', to: '/Supervisor', icon: <FaUserTie /> },
        ];
      } else if (role == 3) {
        items = [
          { component: CNavItem, name: 'Task Management', to: '/task-management', icon: <FaClipboardList /> },
          { component: CNavItem, name: 'User Management', to: '/user-management', icon: <FaUsers /> },
          { component: CNavItem, name: 'Supervisor', to: '/Supervisor', icon: <FaUserTie /> },
        ];
      } else if (role == 4 || role == 6) {
        items = [
          { component: CNavItem, name: 'Task Management', to: '/task-management', icon: <FaClipboardList /> },
          { component: CNavItem, name: 'User Management', to: '/user-management', icon: <FaUsers /> },
        ];
      } else {
        items = [
          { component: CNavItem, name: 'Task Management', to: '/task-management', icon: <FaClipboardList /> },
          { component: CNavItem, name: 'User Management', to: '/user-management', icon: <FaUsers /> },
        ];
      }
      setManagementItems(items); // Set the items dynamically based on the role
    }
  }, [role]); // Run the effect when the role changes

  return (
    <div>
      <CNavTitle>Manage</CNavTitle>
      {managementItems.length > 0 ? (
        <>
          {managementItems.map((item, index) => (
            <item.component key={index} to={item.to} icon={item.icon}>
              {item.name}
            </item.component>
          ))}
        </>
      ) : (
        <p>Loading...</p> // Optionally handle loading state while items are being fetched
      )}
    </div>
  );
};

export default ManagementExport;
