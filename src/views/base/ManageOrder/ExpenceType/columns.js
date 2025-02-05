import BusinessIcon from '@mui/icons-material/Business';
import StoreIcon from '@mui/icons-material/Store';
import CategoryIcon from '@mui/icons-material/Category';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export const COLUMNS = () => [
  {
    Header: 'Expense Type',
    accessor: 'expenceType',
    icon: <CategoryIcon />,
  },
  {
    Header: 'Company Name',
    accessor: 'companyName',
    icon: <BusinessIcon />,
  },
  {
    Header: 'Branch Name',
    accessor: 'branchName',
    icon: <StoreIcon />,
  },
  {
    Header: 'Created At',
    accessor: 'createdAt',
    icon: <AccessTimeIcon />,
  },
  // {
  //   Header: 'Updated At',
  //   accessor: 'updatedAt',
  //   icon: <AccessTimeIcon />,
  // },
];
