import React from 'react';
import CIcon from '@coreui/icons-react';
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
} from '@coreui/icons';
import { FaBoxes, FaUserTie } from 'react-icons/fa';
import { IoLocationOutline } from 'react-icons/io5';
import { BsWindowFullscreen } from 'react-icons/bs';
import { BsChatDots } from 'react-icons/bs';
import { FiList } from 'react-icons/fi';
import { FaRegEdit } from 'react-icons/fa';
import { PiListStarLight } from 'react-icons/pi';
import { LiaFileInvoiceDollarSolid } from 'react-icons/lia';
import { TbReport } from 'react-icons/tb';
import { TbSettings } from 'react-icons/tb';
import { MdOutlineSupportAgent } from "react-icons/md";
import { BiLogOutCircle } from 'react-icons/bi';
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react';
import { FaCarOn, FaUserGroup } from 'react-icons/fa6';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import { FaTasks, FaUsers, FaBuilding, FaLayerGroup, FaMapMarkerAlt } from 'react-icons/fa';
import { FaEdit, FaRegCalendarAlt, FaStore,FaClock ,FaThumbsUp,FaThumbsDown } from 'react-icons/fa';
import { FaFileInvoice, FaClipboardList, FaWarehouse } from 'react-icons/fa';
import { AiOutlineShoppingCart } from "react-icons/ai";
import { MdOutlineAttachMoney } from "react-icons/md";
import { BiMoney } from "react-icons/bi";


const token = Cookies.get("token");

let role = null;

if (token) {
  const decodedToken = jwt_decode(token);
  role = decodedToken.role;
}

console.log(role);

const getRole = () => {
  const token = Cookies.get('token');
  if (token) {
    const decodedToken = jwt_decode(token);
    return decodedToken.role;
  }
  return null;
};

const createNav = () => {
  const role = getRole();

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
      },{
        component: CNavItem,
        name: 'Manage User',
        to: '/UserManage',
        icon: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaUsers style={{ marginRight: '15px', fontSize: '20px' }} />
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
      },{
        component: CNavItem,
        name: 'Manage User',
        to: '/UserManage',
        icon: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaUsers style={{ marginRight: '15px', fontSize: '20px' }} />
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
        name: 'Supervisor',
        to: '/Supervisor',
        icon: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaUserTie style={{ marginRight: '15px', fontSize: '20px' }} />
          </div>
        ),
      }, {
        component: CNavItem,
        name: 'Manage User',
        to: '/UserManage',
        icon: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaUsers style={{ marginRight: '15px', fontSize: '20px' }} />
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
        name: 'Manage User',
        to: '/UserManage',
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
        name: 'Supervisor',
        to: '/Supervisor',
        icon: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaUserTie style={{ marginRight: '15px', fontSize: '20px' }} />
          </div>
        ),
      }, {
        component: CNavItem,
        name: 'Manage User',
        to: '/UserManage',
        icon: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaUsers style={{ marginRight: '15px', fontSize: '20px' }} />
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
        name: 'Manage User',
      to: '/UserManage',
        icon: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaUsers style={{ marginRight: '15px', fontSize: '20px' }} />
          </div>
        ),
      },
    ];
  }

  return [
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
          to: '/attendance1',
          visible: true,
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
              <FaEdit style={{ marginRight: '15px', fontSize: '25px' }} />
            </div>
          ),
        },
        {
          component: CNavItem,
          name: 'Salesman Leave Request',
          to: '/SalesmanLeaveRequest',
          icon: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FaClock  style={{ marginRight: '15px', fontSize: '25px' }} />
            </div>
          ),
        },
        {
          component: CNavItem,
          name: 'Approve Request',
          to: '/ApproveRequest',
          icon: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FaThumbsUp style={{ marginRight: '15px', fontSize: '25px' }} />
            </div>
          ),
        },
        {
          component: CNavItem,
          name: 'Rejected Request',
          to: '/DeniedRequest',
          icon: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FaThumbsDown style={{ marginRight: '15px', fontSize: '25px' }} />
            </div>
          ),
        },
        // {
        //   component: CNavItem,
        //   name: 'Absent Report',
        //   to: '/absent-report',
        //   icon: (
        //     <div style={{ display: 'flex', alignItems: 'center' }}>
        //       <TbReport style={{ marginRight: '15px', fontSize: '25px' }} />
        //     </div>
        //   ),
        // },
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
      name: 'Manage Order',
      icon: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <AiOutlineShoppingCart style={{ marginRight: '15px', fontSize: '20px' }} />
        </div>
      ),
      items: [
        {
          component: CNavItem,
          name: 'Salesman Expences',
          to: '/SalesmanExpenceManagement',
          icon: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <MdOutlineAttachMoney style={{ marginRight: '15px', fontSize: '25px' }} />
            </div>
          ),
        },
        {
          component: CNavItem,
          name: 'Expence Type',
          to: '/ExpenceType',
          icon: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <BiMoney style={{ marginRight: '15px', fontSize: '25px' }} />
            </div>
          ),
        },
      
        {
          component: CNavItem,
          name: 'Chat Bot',
          to: '/chatBot',
          icon: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <BiMoney style={{ marginRight: '15px', fontSize: '25px' }} />
            </div>
          ),
        },
        
      ],
    },
    {
      component: CNavItem,
      name: 'Logout',
      icon: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BiLogOutCircle style={{ marginRight: '15px', fontSize: '25px' }} />
        </div>
      ),
      to: '/logout',
    },
  ];
};

export default createNav;
