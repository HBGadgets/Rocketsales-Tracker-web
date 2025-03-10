
// import React, { useEffect, useState } from "react";
// import { Card, CardContent, Typography, Box, IconButton, CircularProgress } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { CChartLine } from "@coreui/react-chartjs";
// import axios from "axios";
// import Cookies from "js-cookie";
// import RefreshIcon from '@mui/icons-material/Refresh'
// import { useNavigate } from "react-router-dom";
// const OrderCount = () => {
//   const [loading, setLoading] = useState(false);
//   const [orderCount, setOrderCount] = useState(null);
//   const [percentageChange, setPercentageChange] = useState(0);
//   const [chartData, setChartData] = useState([]);
//   const navigate = useNavigate();
//   const fetchData = async () => {
//     setLoading(true);
//     const accessToken = Cookies.get("token");
//     const url = `${import.meta.env.VITE_SERVER_URL}/api/order?filter=today`;
  
//     try {
//       const response = await axios.get(url, {
//         headers: { Authorization: "Bearer " + accessToken },
//       });
  
//       console.log("Response Data:", response.data);
  
//       if (response.data && response.data.data) {
//         const orderList = response.data.data; // The array inside "data"
  
//         // Count the total number of orders
//         setOrderCount(orderList.length);
  
//         // Transform the data into a format suitable for the chart
//         const chartDataFormatted = orderList.map((order, index) => ({
//           date: order.createdAt.substring(0, 10), // Extract date from createdAt
//           value: order.products.reduce((sum, product) => sum + product.quantity, 0), // Sum quantities
//         }));
  
//         setChartData(chartDataFormatted);
  
//         // Example: Calculate percentage change randomly (replace with actual logic)
//         setPercentageChange(Math.floor(Math.random() * 50 + 1));
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   useEffect(() => {
//     fetchData();
//   }, []);
//   const handleCardClick = (e) => {
//     navigate("/Pending-order-list");
//   };
//   return (
//     <Card sx={{ backgroundColor: "#2196F3", color: "white", borderRadius: 3, p: 2, width: 300 }}
//     onClick={(e) => {
//         e.stopPropagation(); // Prevents triggering any parent navigation (UserManage)
//         handleCardClick(e);
//       }}
//     >
//       <CardContent>
//         <Box display="flex" justifyContent="space-between" alignItems="center">
//           <Typography variant="h5" fontWeight="bold">
//             {loading ? <CircularProgress size={20} color="inherit" /> : `Pending Order : ${orderCount}`}
//             {/* <Typography component="span" variant="body2" sx={{ opacity: 0.8, ml: 1 }}>
//               ({percentageChange}% ↑)
//             </Typography> */}
//           </Typography>
//           <IconButton
//                size="small"
//                sx={{ color: "white" }}
//                onClick={(event) => {
//                  event.stopPropagation(); // Prevents navigation
//                  fetchData();
//                }}
//              >
//               <RefreshIcon />
//               </IconButton>
//         </Box>

        

        
//       </CardContent>
      
//     </Card>
//   );
// };

// export default OrderCount;

import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, IconButton, CircularProgress } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";

// Register chart components
ChartJS.register(BarElement, CategoryScale, LinearScale);

const OrderCount = () => {
  const [loading, setLoading] = useState(false);
  const [orderCount, setOrderCount] = useState(null);
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    const accessToken = Cookies.get("token");
    const url = `${import.meta.env.VITE_SERVER_URL}/api/order?filter=today`;

    try {
      const response = await axios.get(url, {
        headers: { Authorization: "Bearer " + accessToken },
      });

      if (response.data && response.data.data) {
        const orderList = response.data.data;
        setOrderCount(orderList.length);

        // Prepare data for the bar chart
        const formattedData = orderList.map((order) =>
          order.products.reduce((sum, product) => sum + product.quantity, 0)
        );

        setChartData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCardClick = () => {
    navigate("/Pending-order-list");
  };

  // Chart.js Data
  const data = {
    labels: chartData.map((_, index) => `Order ${index + 1}`),
    datasets: [
      {
        data: chartData,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
      },
    ],
  };

  // Chart.js Options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } },
  };

  return (
    <Card
      sx={{ backgroundColor: "#D32F2F", color: "white", borderRadius: 3, p: 2, width: 300 }}
      onClick={handleCardClick}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="bold">
            {loading ? <CircularProgress size={20} color="inherit" /> : `Pending Order: ${orderCount}`}
          </Typography>
          <IconButton
            size="small"
            sx={{ color: "white" }}
            onClick={(event) => {
              event.stopPropagation();
              fetchData();
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>

        {/* Bar Chart */}
        <Box sx={{ height: 80, mt: 2 }}>
          <Bar data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderCount;
