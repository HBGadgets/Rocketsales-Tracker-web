import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
// import { TbReport } from 'react-icons/tb'
import { FaBoxes, FaUserTie } from 'react-icons/fa'

import { IoLocationOutline } from 'react-icons/io5'
import { BsWindowFullscreen } from 'react-icons/bs'
import { BsChatDots } from 'react-icons/bs'
import { FiList } from 'react-icons/fi'
import { FaRegEdit } from 'react-icons/fa'
import { PiListStarLight } from 'react-icons/pi'
import { LiaFileInvoiceDollarSolid } from 'react-icons/lia'
import { TbReport } from 'react-icons/tb'
import { TbSettings } from 'react-icons/tb'
import { MdOutlineSupportAgent } from "react-icons/md";
import { BiLogOutCircle } from 'react-icons/bi'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { FaCarOn, FaUserGroup } from 'react-icons/fa6'
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import { FaTasks, FaUsers, FaBuilding, FaLayerGroup, FaMapMarkerAlt } from 'react-icons/fa';
import {  FaEdit, FaRegCalendarAlt, FaStore } from 'react-icons/fa';
import {  FaFileInvoice, FaClipboardList, FaWarehouse } from 'react-icons/fa';
const token=Cookies.get("token");
let role=null
if(token){
  const decodetoken=jwt_decode(token);
   role=decodetoken.role;
}
console.log(role)

// let managementItems = [];
// if (role === 1) {
//   managementItems = [
//     { component: CNavItem, name: 'Task Management', to: '/task-management' },
//     { component: CNavItem, name: 'User Management', to: '/user-management' },
//     { component: CNavItem, name: 'Company', to: '/Company' },
//     { component: CNavItem, name: 'Branch Group', to: '/Branch-Group' },
//     { component: CNavItem, name: 'Branches', to: '/Branches' },
//     { component: CNavItem, name: 'Supervisor', to: '/Supervisor' },
//   ];
// } else if (role === 2) {
//   managementItems = [
//     { component: CNavItem, name: 'Task Management', to: '/task-management' },
//     { component: CNavItem, name: 'User Management', to: '/user-management' },
//     { component: CNavItem, name: 'Branch Group', to: '/Branch-Group' },
//     { component: CNavItem, name: 'Branches', to: '/Branches' },
//     { component: CNavItem, name: 'Supervisor', to: '/Supervisor' },
//   ];
// }else if (role === 3) {
//   managementItems = [
//     { component: CNavItem, name: 'Task Management', to: '/task-management' },
//     { component: CNavItem, name: 'User Management', to: '/user-management' },
//     { component: CNavItem, name: 'Supervisor', to: '/Supervisor' },
//   ];
// }else if (role === 4) {
//   managementItems = [
//     { component: CNavItem, name: 'Task Management', to: '/task-management' },
//     { component: CNavItem, name: 'User Management', to: '/user-management' },
 
//   ];
// }else if (role === 6) {
//   managementItems = [
//     { component: CNavItem, name: 'Task Management', to: '/task-management' },
//     { component: CNavItem, name: 'User Management', to: '/user-management' },

//     { component: CNavItem, name: 'Supervisor', to: '/Supervisor' },
//   ];
// }else{
//   managementItems = [
//     { component: CNavItem, name: 'Task Management', to: '/task-management' },
//     { component: CNavItem, name: 'User Management', to: '/user-management' },
//   ];
// }




let managementItems = [];

if (role === 1) {
  managementItems = [
    {
      component: CNavItem,
      name: 'Task Management',
      to: '/task-management',
      icon: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaTasks style={{ marginRight: '15px', fontSize: '20px' }} />
        </div>
      ),
    },
    {
      component: CNavItem,
      name: 'User Management',
      to: '/user-management',
      icon: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaUsers style={{ marginRight: '15px', fontSize: '20px' }} />
        </div>
      ),
    },
    {
      component: CNavItem,
      name: 'Company',
      to: '/Company',
      icon: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaBuilding style={{ marginRight: '15px', fontSize: '20px' }} />
        </div>
      ),
    },
    {
      component: CNavItem,
      name: 'Branch Group',
      to: '/Branch-Group',
      icon: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaLayerGroup style={{ marginRight: '15px', fontSize: '20px' }} />
        </div>
      ),
    },
    {
      component: CNavItem,
      name: 'Branches',
      to: '/Branches',
      icon: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaMapMarkerAlt style={{ marginRight: '15px', fontSize: '20px' }} />
        </div>
      ),
    },
    {
      component: CNavItem,
      name: 'Supervisor',
      to: '/Supervisor',
      icon: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaUserTie style={{ marginRight: '15px', fontSize: '20px' }} />
        </div>
      ),
    },
  ];
} else if (role === 2) {
  managementItems = [
    {
      component: CNavItem,
      name: 'Task Management',
      to: '/task-management',
      icon: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaTasks style={{ marginRight: '15px', fontSize: '20px' }} />
        </div>
      ),
    },
    {
      component: CNavItem,
      name: 'User Management',
      to: '/user-management',
      icon: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaUsers style={{ marginRight: '15px', fontSize: '20px' }} />
        </div>
      ),
    },
    {
      component: CNavItem,
      name: 'Branch Group',
      to: '/Branch-Group',
      icon: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaLayerGroup style={{ marginRight: '15px', fontSize: '20px' }} />
        </div>
      ),
    },
    {
      component: CNavItem,
      name: 'Branches',
      to: '/Branches',
      icon: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaMapMarkerAlt style={{ marginRight: '15px', fontSize: '20px' }} />
        </div>
      ),
    },
    {
      component: CNavItem,
      name: 'Supervisor',
      to: '/Supervisor',
      icon: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaUserTie style={{ marginRight: '15px', fontSize: '20px' }} />
        </div>
      ),
    },
  ];
} else if (role === 3) {
  managementItems = [
    {
      component: CNavItem,
      name: 'Task Management',
      to: '/task-management',
      icon: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaTasks style={{ marginRight: '15px', fontSize: '20px' }} />
        </div>
      ),
    },
    {
      component: CNavItem,
      name: 'User Management',
      to: '/user-management',
      icon: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaUsers style={{ marginRight: '15px', fontSize: '20px' }} />
        </div>
      ),
    },
    {
      component: CNavItem,
      name: 'Supervisor',
      to: '/Supervisor',
      icon: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaUserTie style={{ marginRight: '15px', fontSize: '20px' }} />
        </div>
      ),
    },
  ];
} else if (role === 4) {
  managementItems = [
    {
      component: CNavItem,
      name: 'Task Management',
      to: '/task-management',
      icon: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaTasks style={{ marginRight: '15px', fontSize: '20px' }} />
        </div>
      ),
    },
    {
      component: CNavItem,
      name: 'User Management',
      to: '/user-management',
      icon: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaUsers style={{ marginRight: '15px', fontSize: '20px' }} />
        </div>
      ),
    },
  ];
} else if (role === 6) {
  managementItems = [
    {
      component: CNavItem,
      name: 'Task Management',
      to: '/task-management',
      icon: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaTasks style={{ marginRight: '15px', fontSize: '20px' }} />
        </div>
      ),
    },
    {
      component: CNavItem,
      name: 'User Management',
      to: '/user-management',
      icon: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaUsers style={{ marginRight: '15px', fontSize: '20px' }} />
        </div>
      ),
    },
    {
      component: CNavItem,
      name: 'Supervisor',
      to: '/Supervisor',
      icon: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaUserTie style={{ marginRight: '15px', fontSize: '20px' }} />
        </div>
      ),
    },
  ];
} else {
  managementItems = [
    {
      component: CNavItem,
      name: 'Task Management',
      to: '/task-management',
      icon: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaTasks style={{ marginRight: '15px', fontSize: '20px' }} />
        </div>
      ),
    },
    {
      component: CNavItem,
      name: 'User Management',
      to: '/user-management',
      icon: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaUsers style={{ marginRight: '15px', fontSize: '20px' }} />
        </div>
      ),
    },
  ];
}

const _nav = [

  
  {
    component: CNavTitle,
    name: 'Admin Menu',
  },
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <BsWindowFullscreen style={{ marginRight: '15px', fontSize: '19px' }} />
      </div>
    ),
  },

 
  {
    component: CNavTitle,
    name: 'Manage',
  },
  // {
  //   component: CNavItem,
  //   name: 'Manage Attendance',
  //   // to: '/attendance',
  //   icon: (
  //     <div style={{ display: 'flex', alignItems: 'center' }}>
  //       <FiList style={{ marginRight: '15px', fontSize: '20px' }} />
  //     </div>
  //   ),
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Attendance',
  //       to: '/attendance',
  //       visible: true,  // This can be a boolean or controlled by a state.
  //       icon: (
  //         <div style={{ display: 'flex', alignItems: 'center' }}>
  //           <FaUserGroup style={{ marginRight: '15px', fontSize: '25px' }} />
  //         </div>
  //       ),
  //     },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Attendance',
  //     //   to: '/attendance',
  //     // },
  //     {
  //       component: CNavItem,
  //       name: 'Manual Attendance',
  //       to: '/manual-attendance',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Leave Application',
  //       to: '/leave-application',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Visit Shop',
  //       to: '/visit-shop',
  //     },
  //   ],
  // },
  {
    component: CNavItem,
    name: 'Manage Attendance',
    icon: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <FiList style={{ marginRight: '15px', fontSize: '20px' }} />
      </div>
    ),
    items: [
      {
        component: CNavItem,
        name: 'Attendance',
        to: '/attendance',
        visible: true, // This can be a boolean or controlled by a state.
        icon: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaUserGroup style={{ marginRight: '15px', fontSize: '25px' }} />
          </div>
        ),
      },
      {
        component: CNavItem,
        name: 'Manual Attendance',
        to: '/manual-attendance',
        icon: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaEdit style={{ marginRight: '15px', fontSize: '25px' }} /> {/* Example icon */}
          </div>
        ),
      },
      {
        component: CNavItem,
        name: 'Leave Application',
        to: '/leave-application',
        icon: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaRegCalendarAlt style={{ marginRight: '15px', fontSize: '25px' }} /> {/* Example icon */}
          </div>
        ),
      },
      {
        component: CNavItem,
        name: 'Visit Shop',
        to: '/visit-shop',
        icon: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaStore style={{ marginRight: '15px', fontSize: '25px' }} /> {/* Example icon */}
          </div>
        ),
      },
    ],
  },
  
  // {
  //   component: CNavItem,
  //   name: 'Manage Order',
  //   // to: '/invoice',
  //   icon: (
  //     <div style={{ display: 'flex', alignItems: 'center' }}>
  //       <FaRegEdit style={{ marginRight: '15px', fontSize: '20px' }} />
  //     </div>
  //   ),
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Invoice',
  //       to: '/invoice',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'PO',
  //       to: '/po',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Inventory Management',
  //       to: '/inventory-management',
  //     },
  //   ],
  // },
  {
    component: CNavItem,
    name: 'Manage Order',
    icon: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <FaRegEdit style={{ marginRight: '15px', fontSize: '20px' }} />
      </div>
    ),
    items: [
      {
        component: CNavItem,
        name: 'Invoice',
        to: '/invoice',
        icon: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaFileInvoice style={{ marginRight: '15px', fontSize: '20px' }} />
          </div>
        ),
      },
      {
        component: CNavItem,
        name: 'PO',
        to: '/po',
        icon: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaClipboardList style={{ marginRight: '15px', fontSize: '20px' }} />
          </div>
        ),
      },
      {
        component: CNavItem,
        name: 'Inventory Management',
        to: '/inventory-management',
        icon: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaWarehouse style={{ marginRight: '15px', fontSize: '20px' }} />
          </div>
        ),
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Management',
    icon: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <PiListStarLight style={{ marginRight: '15px', fontSize: '25px' }} />
      </div>
    ),
    items: managementItems,
  },

  {
    component: CNavItem,
    name: 'Expense Management',
    icon: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <LiaFileInvoiceDollarSolid style={{ marginRight: '15px', fontSize: '22px' }} />
      </div>
    ),
    items: [
      {
        component: CNavItem,
        name: 'Expense Details',
        to: '/expense-details',
        badge: {
          color: 'success',
        },
      },
      {
        component: CNavItem,
        name: 'Manual Expense',
        to: '/manual-expense',
      },
    ],
  },
  // {
  //   component: CNavItem,
  //   name: 'Report Management',
  //   icon: (
  //     <div style={{ display: 'flex', alignItems: 'center' }}>
  //       <TbReport style={{ marginRight: '15px', fontSize: '22px' }} />
  //     </div>
  //   ),
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Inventory',
  //       to: '/inventory',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Employee Details',
  //       to: '/employee-details',
  //     },
  //   ],
  // },
  {
    component: CNavItem,
    name: 'Report Management',
    icon: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <TbReport style={{ marginRight: '15px', fontSize: '22px' }} />
      </div>
    ),
    items: [
      {
        component: CNavItem,
        name: 'Inventory',
        to: '/inventory',
        icon: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaBoxes style={{ marginRight: '15px', fontSize: '20px' }} />
          </div>
        ),
      },
      {
        component: CNavItem,
        name: 'Employee Details',
        to: '/employee-details',
        icon: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaUserTie style={{ marginRight: '15px', fontSize: '20px' }} />
          </div>
        ),
      },
      {
        component: CNavItem,
        name: 'Live Tracking',
        to: '/livetrack',
        icon: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IoLocationOutline style={{ marginLeft: '0px', marginRight: '15px', fontSize: '23px' }} />
          </div>
        ),
      },
      {
        component: CNavItem,
        name: 'Chat Bot',
        to: '/chatbot',
        icon: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <BsChatDots style={{ marginRight: '15px', fontSize: '20px' }} />
          </div>
        ),
      }
    
    ],
  },
  {
    component: CNavItem,
    name: 'Settings',
    to: '/setting',
    icon: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <TbSettings style={{ marginRight: '15px', fontSize: '23px' }} />
      </div>
    ),
  },

  {
    component: CNavItem,
    name: 'Help & Support',
    to: '/h&s',
    icon: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <MdOutlineSupportAgent style={{ marginRight: '15px', fontSize: '23px' }} />
      </div>
    ),
  },
  {
    component: CNavItem,
    name: 'LogOut',
    to: '/login',
    icon: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <BiLogOutCircle style={{ marginRight: '15px', fontSize: '23px' }} />
      </div>
    ),
    onClick: () => handleLogout(), // Add logout function here
  },
]

const handleLogout = () => {
  // Clear the token from localStorage
  localStorage.removeItem('token');

  // Clear the token from cookies (if it's stored there)
  Cookies.remove('token');

  // Optionally, clear any other session-related data
  
  // Redirect to the login page after logout
  navigate('/login');
};

export default _nav