import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import {
  Dashboard,
  VideoCall,
  LocalHospital,
  People,
  History,
  Settings,
  ExitToApp,
  Book,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Navar = () => {
  const navigate = useNavigate();
  const drawerWidth = 240;

  const menuItems = [
    { text: "Appointments", icon: <Dashboard />, path: "/allAppoiment" },
    { text: "Admissions", icon: <People />, path: "/adminAdmit" }, // Fixed path
    { text: "Patients", icon: <VideoCall />, path: "/PatientManagement" },
    { text: "Treatments", icon: <Book />, path: "/TreatmentManagement" },
    { text: "Lab Tests", icon: <LocalHospital />, path: "/LabTests" }, 
    { text: "Discharge", icon: <History />, path: "/discharge/:id" },
    { text: "Payments", icon: <Settings />, path: "/paymentLogin" },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("doctor");
    navigate("/DoctorLogin");
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#2c3e50",
          color: "white",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="h6" noWrap component="div">
          HealthFlow
        </Typography>
      </Box>
      
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              "&:hover": {
                backgroundColor: "#34495e",
              },
            }}
          >
            <ListItemIcon sx={{ color: "white" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            "&:hover": {
              backgroundColor: "#34495e",
            },
          }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Navar;