
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Box, CircularProgress,IconButton } from "@mui/material";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import axios from "axios";
import Cookies from "js-cookie";
import { People, CheckCircle, Cancel } from "@mui/icons-material";
import RefreshIcon from '@mui/icons-material/Refresh'
const fetchSalesmanCount = async (setTotalSalesmen, setLoading) => {
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
  } finally {
    setLoading(false);
  }
};

const fetchSalesmanAttendance = async (setPresentSalesmen, setLoading) => {
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
    } finally {
      setLoading(false);
    }
  };
  
  

const SalesmanCard = () => {
  const [totalSalesmen, setTotalSalesmen] = useState(0);
  const [presentSalesmen, setPresentSalesmen] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSalesmanCount(setTotalSalesmen, setLoading);
    fetchSalesmanAttendance(setPresentSalesmen, setLoading);
  }, []);

  const absentSalesmen = totalSalesmen - presentSalesmen;

  const handleCardClick = (e) => {
    navigate("/UserManage");
  };
  const handleattendance = (e) => {
    navigate("/attendance1"); // Navigates to attendance1
  };
  
  return (

<Card
  sx={{
    backgroundColor: "#5C6BC0",
    color: "#fff",
    borderRadius: 2,
    width: 280,
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
  }}
  onClick={(e) => {
    e.stopPropagation(); // Prevents triggering any parent navigation (UserManage)
    handleCardClick(e);
  }}
>
<CardContent>
  {/* Top Section */}
  <Box display="flex" justifyContent="space-between" alignItems="center">
    <Typography variant="h6">
      {loading ? <CircularProgress size={20} color="inherit" /> : `Salesman: ${totalSalesmen}`}
    </Typography>
    <IconButton
      size="small"
      sx={{ color: "white" }}
      onClick={(event) => {
        event.stopPropagation(); // Prevents navigation
        fetchSalesmanCount(setTotalSalesmen, setLoading);
        fetchSalesmanAttendance(setPresentSalesmen, setLoading);
      }}
    >
      <RefreshIcon />
    </IconButton>
  </Box>

  {/* Stats Section */}
  <Typography 
    variant="body2" 
    onClick={(e) => {
      e.stopPropagation(); // Prevents triggering any parent navigation (UserManage)
      handleattendance();
    }}
    sx={{ cursor: "pointer"}}
  >
    Present: {loading ? "..." : presentSalesmen}
  </Typography>
  
  <Typography 
    variant="body2" 
    onClick={(e) => {
      e.stopPropagation(); 
      handleattendance();
    }}
    sx={{ cursor: "pointer"}}
  >
    Absent: {loading ? "..." : absentSalesmen}
  </Typography>

  {/* Graph at the bottom */}
  <Box sx={{ height: 50, mt: 2 }}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={[{ value: 100 }, { value: 200 }, { value: 150 }]}>
        <Line type="monotone" dataKey="value" stroke="#fff" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </Box>
</CardContent>

</Card>


  );
};

export default SalesmanCard;
