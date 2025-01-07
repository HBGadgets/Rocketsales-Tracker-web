import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VpnKeyIcon from '@mui/icons-material/VpnKey'; // Icon for password
import { FiGitBranch } from 'react-icons/fi';

export const COLUMNS = () => [
  {
    Header: 'Company Name',
    accessor: 'companyName',
    icon: <BusinessIcon />, // Business icon represents the company
  },
  {
    Header: 'Branch Name',
    accessor: 'branchName',
    icon: <FiGitBranch />, // Domain icon represents a branch
  },
  {
    Header: 'Branch Location',
    accessor: 'branchLocation',
    icon: <LocationOnIcon />, // Location icon for branch location
  },
  {
    Header: 'User Name',
    accessor: 'branchUsername',
    icon: <AccountCircleIcon />, // AccountCircle icon for username
  },
  {
    Header: 'Password',
    accessor: 'branchPassword',
    icon: <VpnKeyIcon />, // VpnKey icon for password
  },
];
