import { Person, Email, Phone, Business, AccessTime } from '@mui/icons-material';

export const COLUMNS = () => [
  {
    Header: 'Salesman Name',
    accessor: 'salesmanName',
    icon: <Person />,
  },
  {
    Header: 'Salesman Email',
    accessor: 'salesmanEmail',
    icon: <Email />,
  },
  {
    Header: 'Salesman Phone',
    accessor: 'salesmanPhone',
    icon: <Phone />,
  },
  {
    Header: 'Company Name',
    accessor: 'companyName', // Changed to match the processed data field
    icon: <Business />,
  },
  {
    Header: 'Branch Name',
    accessor: 'branchName', // Changed to match the processed data field
    icon: <Business />,
  },
  {
    Header: 'Supervisor Name',
    accessor: 'supervisorName', // Changed to match the processed data field
    icon: <Person />,
  },
  {
    Header: 'Created At',
    accessor: 'createdAt', // This corresponds to the formatted date field
    icon: <AccessTime />,
  },
];
