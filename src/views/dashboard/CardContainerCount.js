import React from "react";
import { Box } from "@mui/material";
import SalesmanCard from "./dashboardCard/SalesmanCard"
import TaskManagementCard from "./dashboardCard/TaskManagementCard";
import OrderCount from "./dashboardCard/OrderCount";

const CardContainerCount = () => {
  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      <SalesmanCard /> {/* Salesman count card */}
      <TaskManagementCard/>
      <OrderCount/>
      {/* You can add more cards here */}
    </Box>
  );
};

export default CardContainerCount;
