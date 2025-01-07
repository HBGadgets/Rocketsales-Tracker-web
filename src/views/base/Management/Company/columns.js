import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import GavelIcon from '@mui/icons-material/Gavel';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LockIcon from '@mui/icons-material/Lock';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Specific icon for username

export const COLUMNS = () => [
  {
    Header: 'Company Name',
    accessor: 'companyName',
    icon: <BusinessIcon />,
  },
  {
    Header: 'Company Email',
    accessor: 'companyEmail',
    icon: <EmailIcon />,
  },
  {
    Header: 'Owner Name',
    accessor: 'ownerName',
    icon: <PersonIcon />,
  },
  {
    Header: 'Owner Email',
    accessor: 'ownerEmail',
    icon: <EmailIcon />,
  },
  {
    Header: 'GST Number',
    accessor: 'gstNo',
    icon: <CreditCardIcon />, // Specific icon for GST
  },
  {
    Header: 'PAN Number',
    accessor: 'panNo',
    icon: <GavelIcon />, // Specific icon for PAN
  },
  {
    Header: 'Business Type',
    accessor: 'businessType',
    icon: <AccountBalanceIcon />,
  },
  {
    Header: 'Company Username',
    accessor: 'companyUsername',
    icon: <AccountCircleIcon />, // Unique icon for username
  },
  {
    Header: 'Company Password',
    accessor: 'companyPassword',
    icon: <LockIcon />,
  },
  {
    Header: 'Created At',
    accessor: 'created_at',
   
  },
];
