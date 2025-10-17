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
  Book, // Added Book icon for SOAP Notes
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const drawerWidth = 240;

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/DoctorDashboard" },
    { text: "Patients Records", icon: <People />, path: "/PatientsPage" },
    { text: "Consultation", icon: <VideoCall />, path: "/TelemedicineConsultation" },
    { text: "SOAP Notes", icon: <Book />, path: "/TelemedicineConsultation" }, // Fixed: Changed <book /> to <Book />
    { text: "Prescriptions", icon: <LocalHospital />, path: "/Prescriptions" }, 
    { text: "Diagnostic Orders", icon: <History />, path: "/MedicalRecords" }, // Fixed typo: "Giagnostic" to "Diagnostic"
    { text: "Referrals", icon: <Settings />, path: "/DoctorProfilePage" },
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

export default Sidebar;