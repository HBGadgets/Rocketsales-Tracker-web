import React from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'
import avatar8 from './../../assets/images/avatars/8.jpg'
import Cookies from 'js-cookie'
import jwtDecode from 'jwt-decode';
const AppHeaderDropdown = () => {
  const navigate = useNavigate();
  
    // const handleLogout = () => {
    //   // Clear the token from localStorage
    //   localStorage.removeItem('token');
  
    //   // Clear the token from cookies (if it's stored there)
    //   Cookies.remove('token');
  
    //   // Redirect to the login page after logout
    //   navigate('/login');
    // };
    const handleLogout = async () => {
    
      // Retrieve token from localStorage or cookies
      const token =  Cookies.get('token');
    
      if (token) {
        try {
          // Decode the token to extract user details
          const decodedToken = jwtDecode(token);
          const username = decodedToken?.username;
          const role = decodedToken?.role;
    
          if (role === 5) {
            // Call the logout API if role is 5
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/logout`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ username }),
            });
    
            if (!response.ok) {
              throw new Error('Logout request failed');
            }
          }
    
          // Remove authentication data regardless of role
          localStorage.removeItem('token');
          Cookies.remove('token');
    
          // Redirect to login page
          navigate('/login');
        } catch (error) {
          console.error('Error logging out:', error);
        }
      } else {
        // If no token is found, just navigate to login
        navigate('/login');
      }
    };
    const handleSettingsClick = () => {
      navigate('/setting'); // Navigate to the /setting route
    };
    const handleheplandsupportClick = () => {
      navigate('/h&s'); // Navigate to the /setting route
    };
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilBell} className="me-2" />
          Updates
          <CBadge color="info" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilEnvelopeOpen} className="me-2" />
          Messages
          <CBadge color="success" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilTask} className="me-2" />
          Tasks
          <CBadge color="danger" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilCommentSquare} className="me-2" />
          Comments
          <CBadge color="warning" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem onClick={handleSettingsClick}>
      <CIcon icon={cilSettings} className="me-2" />
      Settings
    </CDropdownItem>
    <CDropdownItem onClick={handleheplandsupportClick}>
      <CIcon icon={cilSettings} className="me-2" />
      Help & Support
    </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilCreditCard} className="me-2" />
          Payments
          <CBadge color="secondary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilFile} className="me-2" />
          Projects
          <CBadge color="primary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem href="#">
          <CIcon icon={cilLockLocked} className="me-2" />
          Lock Account
        </CDropdownItem>
          <CDropdownItem onClick={handleLogout}>
                  <CIcon icon={cilLockLocked} className="me-2" />
                  Log Out
                </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
