import { Timeline, LocationOn, AccessTime } from '@mui/icons-material';

export const COLUMNS = () => [
  {
    Header: 'Date',
    accessor: 'date', // Corresponds to the date field
    // icon: <AccessTime />,
  },
  
  {
    Header: 'Start Latitude',
    accessor: 'startLat', // Latitude of start point
    // icon: <LocationOn />,
  },
  {
    Header: 'Start Longitude',
    accessor: 'startLong', // Longitude of start point
    // icon: <LocationOn />,
  },
  {
    Header: 'End Latitude',
    accessor: 'endLat', // Latitude of end point
    // icon: <LocationOn />,
  },
  {
    Header: 'End Longitude',
    accessor: 'endLong', // Longitude of end point
    // icon: <LocationOn />,
  },
  {
    Header: 'Total Distance',
    accessor: 'totalDistance', // Corresponds to the total distance traveled
    // icon: <Timeline />,
  },
];
