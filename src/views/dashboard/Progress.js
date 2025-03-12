import React, { useEffect,useState }  from 'react';
import { CCardFooter, CRow, CCol, CProgress } from '@coreui/react'
import classNames from 'classnames'
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function Progress() {
  
   const [totalSalesmen, setTotalSalesmen] = useState(0);
   const [presentSalesmen, setPresentSalesmen] = useState(0);
     const [completed, setCompleted] = useState(0)
     const [pending, setPending] = useState(0)
     const [totalOrders, setTotalOrders] = useState(0); 
     const [invoicecount,setinvoicecount]=useState(0);
      const navigate = useNavigate();
const fetchSalesmanCount = async () => {
  const accessToken = Cookies.get("token");
  const url = `${import.meta.env.VITE_SERVER_URL}/api/salesman`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.data && response.data.salesmandata) {
      setTotalSalesmen(response.data.salesmandata.length); // Set total salesmen count
    } else {
      console.error("Salesman data is missing or incorrectly structured.");
    }
  } catch (error) {
    console.error("Error fetching salesman data:", error);
  } 
};
const fetchSalesmanAttendance = async () => {
    const accessToken = Cookies.get('token');
    const url = `${import.meta.env.VITE_SERVER_URL}/api/attendence`; // ✅ Corrected URL declaration
  
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      console.log('Response:', response.data);
  
      if (response.data && response.data.data) {
        // Filter salesmen who are present
        const presentCount = response.data.data.filter(
          (salesman) => salesman.attendenceStatus === "Present"
        ).length;
  
        console.log("My salesman attendance count:", presentCount);
        setPresentSalesmen(presentCount);
      } else {
        console.error("Attendance data is missing or incorrectly structured.");
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } 
  };
  const fetchTaskCount = async () => {
    const accessToken = Cookies.get('token')
    const url = `${import.meta.env.VITE_SERVER_URL}/api/task`
  
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
  
      if (response.data) {
        const tasks = response.data
        console.log('my response task', tasks)
        const completedTasks = tasks.filter((task) => task.status == 'Completed').length
        const pendingTasks = tasks.filter((task) => task.status == 'Pending').length
        console.log('completed', completedTasks)
        console.log('pending', pendingTasks)
        setCompleted(completedTasks)
        setPending(pendingTasks)
      } else {
        console.error('Task data is missing or incorrectly structured.')
      }
    } catch (error) {
      console.error('Error fetching task data:', error)
    }
  }
  const fetchOrderCount = async () => {
    const accessToken = Cookies.get('token');
    const url = `${import.meta.env.VITE_SERVER_URL}/api/order`;
  
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      if (response.data && response.data.data) {
        const totalOrders = response.data.data.length;
        console.log('Total Orders:', totalOrders);
        setTotalOrders(totalOrders);
      } else {
        console.error('Order data is missing or incorrectly structured.');
      }
    } catch (error) {
      console.error('Error fetching order data:', error);
    }
  };
  const fetchinvoiceCount = async () => {
    const accessToken = Cookies.get("token");
    const url = `${import.meta.env.VITE_SERVER_URL}/api/invoice`;
  
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      if (response.data ) {
        setinvoicecount(response.data.data.length); // Set total salesmen count
      } else {
        console.error("invoice data is missing or incorrectly structured.");
      }
    } catch (error) {
      console.error("Error fetching salesman data:", error);
    } 
  };
  const totalTasks = completed + pending
  const ordersum=totalOrders+invoicecount
  const getColorByPercent = (percent) => {
    if (percent >= 75) return 'success'; // Green
    if (percent >= 50) return 'warning'; // Yellow-Orange
    if (percent >= 25) return 'info';    // Blue
    return 'danger';                     // Red
  };
  
  const progressExample = [
    {
      title: 'SalesMan',
      value: `${totalSalesmen}`,
      percent: 100,
      color: 'success',
    },
    {
      title: 'Present-Absent',
      value: `${presentSalesmen}/${totalSalesmen}`,
      percent: totalSalesmen > 0 ? Math.round((presentSalesmen / totalSalesmen) * 100) : 0,
      color: getColorByPercent(totalSalesmen > 0 ? Math.round((presentSalesmen / totalSalesmen) * 100) : 0),
    },
    {
      title: 'Total-Task',
      value: `${completed}/${totalTasks}`,
      percent: totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0,
      color: getColorByPercent(totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0),
    },
    {
      title: 'Orders',
      value: `${totalOrders}/${ordersum}`,
      percent:ordersum > 0 ? Math.round((totalOrders / ordersum) * 100) : 0,
      color: getColorByPercent(totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0), // You can also apply dynamic logic here if needed
    },
  ];
  
useEffect(()=>{
  fetchSalesmanCount()
  fetchSalesmanAttendance()
  fetchTaskCount()
  fetchOrderCount()
  fetchinvoiceCount()
},[])
const handleNavigate = (title) => {
  switch (title) {
    case 'SalesMan':
      navigate('/UserManage'); // Replace with actual route
      break;
    case 'Present-Absent':
      navigate('/attendance1'); // Replace with actual route
      break;
    case 'Total-Task':
      navigate('/task-management'); // Replace with actual route
      break;
    case 'Orders':
      navigate('/Pending-order-list'); // Replace with actual route
      break;
    default:
      navigate('/dashboard'); // Fallback route
  }
};
  return (
    <div>
      <CCardFooter>
        <CRow
          xs={{ cols: 1, gutter: 4 }}
          sm={{ cols: 2 }}
          lg={{ cols: 4 }}
          // xl={{ cols: 5 }}
          className="mb-2 text-center"
        >
          {progressExample.map((item, index, items) => (
            <CCol
              className={classNames({
                'd-none d-xl-block': index + 1 === items.length,
              })}
              key={index}
              onClick={() => handleNavigate(item.title)}
              style={{ cursor: 'pointer' }}
            >
              <div className="text-body-secondary">{item.title}</div>
              <div className="fw-semibold text-truncate">
                {item.value} ({item.percent}%)
              </div>
              <CProgress thin className="mt-2" color={item.color} value={item.percent} />
            </CCol>
          ))}
        </CRow>
      </CCardFooter>
    </div>
  )
}
