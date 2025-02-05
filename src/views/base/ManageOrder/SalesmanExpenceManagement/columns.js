import BusinessIcon from '@mui/icons-material/Business'
import PersonIcon from '@mui/icons-material/Person'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import DescriptionIcon from '@mui/icons-material/Description'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import BadgeIcon from '@mui/icons-material/Badge'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'

export const COLUMNS = () => [
  {
    Header: 'Salesman Name',
    accessor: 'salesmanName',
    icon: <BadgeIcon />,
  },
  {
    Header: 'Expense Type',
    accessor: 'expenceType',
    icon: <DescriptionIcon />,
  },
  {
    Header: 'Description',
    accessor: 'expenceDescription',
    icon: <DescriptionIcon />,
  },
  {
    Header: 'Date',
    accessor: 'date',
    icon: <CalendarTodayIcon />,
  },
  {
    Header: 'Amount',
    accessor: 'amount',
    icon: <MonetizationOnIcon />,
  },
  
  {
    Header: 'Company Name',
    accessor: 'companyName',
    icon: <BusinessIcon />,
  },
  {
    Header: 'Branch Name',
    accessor: 'branchName',
    icon: <AccountBalanceIcon />,
  },
  {
    Header: 'Supervisor Name',
    accessor: 'supervisorName',
    icon: <SupervisorAccountIcon />,
  },
  {
    Header: 'Created At',
    accessor: 'createdAt',
    icon: <CalendarTodayIcon />,
  },
]
