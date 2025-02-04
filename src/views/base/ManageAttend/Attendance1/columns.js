import { CheckCircle, Cancel, Person, Business, SupervisorAccount, AccessTime, Image } from '@mui/icons-material';

export const COLUMNS = () => [

  {
    Header: 'Profile Image',
    accessor: 'profileImgUrl',
    icon: <Image />,
    //  Cell: ({ value }) => value ? <img src={value} alt="Profile" style={{ width: 40, height: 40, borderRadius: '50%' }} /> : 'N/A',
  },
  {
    Header: 'Salesman Name',
    accessor: 'salesmanName',
    icon: <Person />,
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
    icon: <SupervisorAccount />,
  },
  {
    Header: 'Attendance Status',
    accessor: 'attendenceStatus',
    icon: (row) => row.attendenceStatus === 'Present' ? <CheckCircle style={{ color: 'green' }} /> : <Cancel style={{ color: 'red' }} />,
  },
  {
    Header: 'Created At',
    accessor: 'createdAt',
    icon: <AccessTime />,

  },
  
];
