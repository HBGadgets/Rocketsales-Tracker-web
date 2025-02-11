import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VpnKeyIcon from '@mui/icons-material/VpnKey'; // Icon for password
import { FiGitBranch } from 'react-icons/fi';
import EmailIcon from '@mui/icons-material/Email';
import { PhoneAndroid } from '@mui/icons-material';

// export const COLUMNS = () => [
//   {
//     Header: 'Salesman Name',
//     accessor: 'salesmanName',
//     icon: <AccountCircleIcon />, // AccountCircle icon for salesman's name
//   },
//   {
//     Header: 'Salesman Email',
//     accessor: 'salesmanEmail',
//     icon: <EmailIcon />, // Email icon for salesman's email
//   },
//   {
//     Header: 'Salesman Phone',
//     accessor: 'salesmanPhone',
//     icon: <PhoneAndroid />, // PhoneAndroid icon represents the phone
//   },
//   {
//     Header: 'Username',
//     accessor: 'username',
//     icon: <AccountCircleIcon />, // AccountCircle icon for username
//   },
//   {
//     Header: 'Password',
//     accessor: 'password',
//     icon: <VpnKeyIcon />, // VpnKey icon for password
//   },
//   {
//     Header: 'Company Name',
//     accessor: 'companyName', // Nested accessor for company name
//     icon: <BusinessIcon />, // Business icon represents the company
//   },
//   {
//     Header: 'Branch Name',
//     accessor: 'branchName', // Nested accessor for branch name
//     icon: <FiGitBranch />, // Branch icon represents a branch
//   },
//   {
//     Header: 'supervisor Name',
//     accessor: 'supervisorName', // Nested accessor for branch name
//     icon: <FiGitBranch />, // Branch icon represents a branch
//   },
//   {
//     Header: 'Created At',
//     accessor: 'createdAt',
//     icon: null, // No icon for created at
//   },
// ];

export const  COLUMNS = (role) => {
  if (role == 5) {
    return [
      { Header: 'Task Description', accessor: 'taskDescription' },
      { Header: 'Deadline', accessor: 'deadline' },
      { Header: 'Status', accessor: 'status' },
    ];
  }

  return [
    {
      Header: 'Salesman Name',
      accessor: 'salesmanName',
      icon: <AccountCircleIcon />,
    },
    {
      Header: 'Salesman Email',
      accessor: 'salesmanEmail',
      icon: <EmailIcon />,
    },
    {
      Header: 'Salesman Phone',
      accessor: 'salesmanPhone',
      icon: <PhoneAndroid />,
    },
    {
      Header: 'Username',
      accessor: 'username',
      icon: <AccountCircleIcon />,
    },
    {
      Header: 'Password',
      accessor: 'password',
      icon: <VpnKeyIcon />,
    },
    {
      Header: 'Company Name',
      accessor: 'companyName',
      icon: <BusinessIcon />,
    },
    {
      Header: 'Branch Name',
      accessor: 'branchName',
      icon: <FiGitBranch />,
    },
    {
      Header: 'Supervisor Name',
      accessor: 'supervisorName',
      icon: <FiGitBranch />,
    },
    {
      Header: 'Created At',
      accessor: 'createdAt',
      icon: null,
    },
  ];
};