import { Person, Business, AccessTime, Description, Event, LocationOn } from '@mui/icons-material';

export const COLUMNS = () => [
  {
    Header: 'Task Description',
    accessor: 'taskDescription', // Task description field
    icon: <Description />,
  },
  {
    Header: 'Status',
    accessor: 'status', // Status of the task
    icon: <Event />,
  },
  {
    Header: 'Deadline',
    accessor: 'deadline', // Task deadline
    icon: <AccessTime />,
  },
  {
    Header: 'Salesman Name',
    accessor: 'salesmanName', // Extracted from assignedTo.salesmanName
    icon: <Person />,
  },
  {
    Header: 'Company Name',
    accessor: 'companyName', // Extracted from companyId.companyName
    icon: <Business />,
  },
  {
    Header: 'Branch Name',
    accessor: 'branchName', // Extracted from branchId.branchName
    icon: <Business />,
  },
  {
    Header: 'Supervisor Name',
    accessor: 'supervisorName', // Extracted from supervisorId.supervisorName
    icon: <Person />,
  },
  {
    Header: 'Address',
    accessor: 'address', // Address field
    icon: <LocationOn />,
  },
  {
    Header: 'Created At',
    accessor: 'createdAt', // Task creation date
    icon: <AccessTime />,
  },
  {
    Header: 'Updated At',
    accessor: 'updatedAt', // Task last updated date
    icon: <AccessTime />,
  },
];
