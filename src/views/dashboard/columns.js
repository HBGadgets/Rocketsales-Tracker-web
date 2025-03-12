import React from 'react';
import { FaBatteryFull, FaBatteryHalf, FaBatteryEmpty } from 'react-icons/fa';
import { MdBatteryFull } from "react-icons/md";
import { MdBattery50 } from "react-icons/md";
import { MdBattery20 } from "react-icons/md";
export const columns = [
  // {
  //   Header: 'Profile',
  //   accessor: 'profileImage',
  // },
  {
    Header: 'Name',
    accessor: 'salesmanName',
  },
  {
    Header: 'Username Name',
    accessor: 'username',
  },
  {
    Header: 'Phone',
    accessor: 'salesmanPhone',
  },
  {
    Header: 'Company ', // Since there's no companyName in the data
    accessor: 'companyName',
  },
  {
    Header: 'Branch ', // Since there's no branchName in the data
    accessor: 'branchName',
  },
  {
    Header: 'Supervisor ', // Since there's no supervisorName in the data
    accessor: 'supervisorName',
  },
  {
    Header: 'Created At',
    accessor: 'createdAt',
    //  Cell: ({ value }) => (value ? new Date(value).toLocaleDateString() : 'N/A'),
  },
  {
    Header: 'Battery',
    accessor: 'batteryLevel',
    Cell: ({ value }) => {
      const battery = Number(value) ;
      const iconSize = '30px'; // Increase the icon size here
      let icon;
      if (isNaN(battery)) {
        return <span>--</span>;
      }

      if (battery > 60) {
        icon = <MdBatteryFull style={{ color: 'green', fontSize: iconSize }} />;
      } else if (battery >= 20) {
        icon = <MdBattery50 style={{ color: 'orange', fontSize: iconSize }} />;
      } else if (battery >= 0)  {
        icon = <MdBattery20 style={{ color: 'red', fontSize: iconSize }} />;
      }else{

      }

      return <span>{icon} <strong>{battery}%</strong></span>;
    }
  },
  {
    Header: 'Last Updated At',
    accessor: 'timestamp',
    // Cell: ({ value }) => (value ? new Date(value).toLocaleDateString() : 'N/A'),
    
  },
  {
    Header: 'Status',
    accessor: 'timestamp',
    id: 'status',
    Cell: ({ value }) => {
      if (!value) return <span>--</span>;
  
      const now = new Date();
      const timestampDate = new Date(value);
      const diffSeconds = (now - timestampDate) / 1000;
  
      return diffSeconds <= 20? (
        <span><strong>🟢 Online</strong></span>
      ) : (
        <span><strong>🔴 Offline</strong></span>
      );
    }
  }
];
