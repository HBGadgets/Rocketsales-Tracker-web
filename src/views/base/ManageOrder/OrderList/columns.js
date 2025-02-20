import { CheckCircle, Cancel, Person, Business, SupervisorAccount, AccessTime, Image } from '@mui/icons-material';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VpnKeyIcon from '@mui/icons-material/VpnKey'; // Icon for password
import { FiGitBranch } from 'react-icons/fi';
import EmailIcon from '@mui/icons-material/Email';
import { PhoneAndroid } from '@mui/icons-material';
import { FaBox } from 'react-icons/fa';
import { FaHashtag } from 'react-icons/fa';
import {  LocationOn, Event, Phone } from '@mui/icons-material';


export const COLUMNS = () => [

  // {
  //   Header: 'product Name',
  //   accessor: 'productName',
  //    icon: <FaBox />,
  //   //  Cell: ({ value }) => value ? <img src={value} alt="Profile" style={{ width: 40, height: 40, borderRadius: '50%' }} /> : 'N/A',
  // },
  // {
  //   Header: 'Quantity',
  //   accessor: 'quantity',
  //   icon: <FaHashtag />,
    
  // },
  {
    Header: 'Shop Name',
    accessor: 'shopName',
    icon: <Business />,
  },
  {
    Header: 'Shop Address',
    accessor: 'shopAddress',
    icon: <LocationOn />,
  },
  {
    Header: 'Delivery Date',
    accessor: 'deliveryDate',
    icon: <Event />,
  },
  {
    Header: 'Shop Owner Name',
    accessor: 'shopOwnerName',
    icon: <SupervisorAccount />,
  },
  {
    Header: 'Shop Owner Phone No',
    accessor: 'phoneNo',
    icon: <Phone />,
  },
  {
    Header: 'Salesman Name',
    accessor: 'salesmanName', // Use the transformed field
  },
  // {
  //   Header: 'Supervisor Name',
  //   accessor: 'supervisorName', // Use the transformed field
  // },
  // {
  //   Header: 'Branch Name',
  //   accessor: 'branchName', // Use the transformed field
  // },
  // {
  //   Header: 'Company Name',
  //   accessor: 'companyName', // Use the transformed field
  // },
  {
    Header: 'Company Name',
    accessor: 'companyName', // Nested accessor for company name
    icon: <BusinessIcon />, // Business icon represents the company
  },
  {
    Header: 'Branch Name',
    accessor: 'branchName', // Nested accessor for branch name
    icon: <FiGitBranch />, // Branch icon represents a branch
  },
  {
    Header: 'supervisor Name',
    accessor: 'supervisorName', // Nested accessor for branch name
    icon: <FiGitBranch />, // Branch icon represents a branch
  },
  {
    Header: 'Created At',
    accessor: 'createdAt',
    icon: <AccessTime />,

  },
  
];
