import { Person, Business, Event, Description, AccessTime, Assignment } from '@mui/icons-material';

export const COLUMNS = () => [
  {
    Header: 'Salesman Name',
    accessor: 'salesmanName',
    icon: <Person />,
  },
  // {
  //   Header: 'Leave Status',
  //   accessor: 'leaveRequestStatus',
  //   icon: <Assignment />,
  // },
  {
    Header: 'Leave Start Date',
    accessor: 'leaveStartdate',
    icon: <Event />,
  },
  {
    Header: 'Leave End Date',
    accessor: 'leaveEnddate',
    icon: <Event />,
  },
  {
    Header: 'Reason',
    accessor: 'reason',
    icon: <Description />,
  },
  {
    Header: 'Company Name',
    accessor: 'companyName',
    icon: <Business />,
  },
  {
    Header: 'Branch Name',
    accessor: 'branchName',
    icon: <Business />,
  },
  {
    Header: 'Supervisor Name',
    accessor: 'supervisorName',
    icon: <Person />,
  },
  {
    Header: 'Created At',
    accessor: 'createdAt',
    icon: <AccessTime />,
  },
];
