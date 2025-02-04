import { Person, Email, Phone, Business, AccessTime } from '@mui/icons-material';

export const COLUMNS = () => [
  {
    Header: 'Salesman Name',
    accessor: 'salesmanName', // Corresponds to processed data
    icon: <Person />,
  },
  
  {
    Header: 'Company Name',
    accessor: 'companyName', // Corresponds to processed data
    icon: <Business />,
  },
  {
    Header: 'Branch Name',
    accessor: 'branchName', // Corresponds to processed data
    icon: <Business />,
  },
  {
    Header: 'Supervisor Name',
    accessor: 'supervisorName', // Corresponds to processed data
    icon: <Person />,
  },
  {
    Header: 'Leave Start Date',
    accessor: 'leaveStartdate', // Corresponds to leave start date field
    icon: <AccessTime />,
  },
  {
    Header: 'Leave End Date',
    accessor: 'leaveEnddate', // Corresponds to leave end date field
    icon: <AccessTime />,
  },
  {
    Header: 'Reason',
    accessor: 'reason', // Corresponds to leave reason field
    icon: <Business />,
  },
  {
    Header: 'Request Date',
    accessor: 'createdAt', // Corresponds to the formatted date field
    icon: <AccessTime />,
  },
  {
    Header: 'Rejected Date',
    accessor: 'updatedAt', // Corresponds to the formatted date field
    icon: <AccessTime />,
  },
];
