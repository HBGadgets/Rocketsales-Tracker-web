import { CheckCircle, Cancel, Person, Business, SupervisorAccount, AccessTime, Image } from '@mui/icons-material';

export const COLUMNS = () => [

  {
    Header: 'Customer Name',
    accessor: 'customerName',
    icon: <Image />,
    //  Cell: ({ value }) => value ? <img src={value} alt="Profile" style={{ width: 40, height: 40, borderRadius: '50%' }} /> : 'N/A',
  },
  {
     Header: 'Customer Address',
     accessor: 'customerAddress',
     icon: <Business />,
   },
  {
     Header: 'Company Name',
     accessor: 'companyName',
     icon: <Business />,
   },
  {
    Header: 'Company Address',
    accessor: 'companyAddress',
    icon: <Person />,
  },
  {
     Header: 'Branch Name',
     accessor: 'branchName',
     icon: <Business />,
   },
  {
     Header: 'Supervisor Name',
     accessor: 'supervisorName',
     icon: <Business />,
   },
 
  {
    Header: 'Date of Generate',
    accessor: 'date',
    icon: <Business />,
  },
  {
    Header: 'GST Amount',
    accessor: 'gst',
    icon: <SupervisorAccount />,
  },
  {
    Header: 'HSNcode',
    accessor: 'HSNcode',
    icon: (row) => row.attendenceStatus === 'Present' ? <CheckCircle style={{ color: 'green' }} /> : <Cancel style={{ color: 'red' }} />,
  },
  {
    Header: 'Discount',
    accessor: 'discount',
    icon: <AccessTime />,

  },
  {
    Header: 'Total Amount',
    accessor: 'totalAmount',
    icon: <AccessTime />,

  },

  
];
