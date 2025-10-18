import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  Button,
  Typography,
  Avatar,
  Divider,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

const SideBar = () => {
  const [selectedItem, setSelectedItem] = useState("PatientsPage");
  const doctor = JSON.parse(sessionStorage.getItem("doctor"));

  useEffect(() => {
    const storedSelectedItem = window.sessionStorage.getItem("selectedItem");
    if (storedSelectedItem) {
      setSelectedItem(storedSelectedItem);
    }
  }, []);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    window.sessionStorage.setItem("selectedItem", item);
    window.location.href = `/${item}`;
  };

  const handleLogout = () => {
    sessionStorage.setItem("doctor", JSON.stringify(null));
    window.location.href = `/DoctorLogin`;
  };

  return (
    <Drawer
      anchor="left"
      variant="permanent"
      sx={{
        width: 280,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 280,
          boxSizing: "border-box",
          backgroundColor: "#f5f7fa",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRight: "none",
          backgroundImage: "url(/path-to-your-background-image.png)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        },
      }}
    >
      <Avatar
        alt="D"
        src={doctor.picture || "/default-profile.png"}
        sx={{
          width: 100,
          height: 100,
          marginBottom: "15px",
          border: "3px solid #ecf0f1",
        }}
      />
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#3c3c3c" }}>
        Dr. {doctor.firstName} {doctor.lastName}
      </Typography>
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{ marginBottom: "10px", color: "#9e9e9e" }}
      >
        {doctor.specialisation}
      </Typography>
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{ marginBottom: "20px", color: "#9e9e9e" }}
      >
        {doctor.locations}
      </Typography>
      <Divider
        sx={{ width: "100%", marginBottom: "20px", borderColor: "#e0e0e0" }}
      />

      <List sx={{ width: "100%" }}>
        <ListItem sx={{ padding: 0, marginBottom: "15px" }}>
          <Button
            fullWidth
            variant={selectedItem === "PatientsPage" ? "contained" : "outlined"}
            onClick={() => handleItemClick("PatientsPage")}
            color="secondary"
            sx={{
              textTransform: "none",
              justifyContent: "center",
              fontWeight: "bold",
              borderRadius: "10px",
              padding: "12px 0",
              boxShadow:
                selectedItem === "PatientsPage"
                  ? "0px 4px 10px rgba(0, 0, 0, 0.1)"
                  : "none",
            }}
          >
            Patients
          </Button>
        </ListItem>

        <ListItem sx={{ padding: 0, marginBottom: "15px" }}>
          <Button
            fullWidth
            variant={selectedItem === "Map" ? "contained" : "outlined"}
            onClick={() => handleItemClick("Map")}
            color="secondary"
            sx={{
              textTransform: "none",
              justifyContent: "center",
              fontWeight: "bold",
              borderRadius: "10px",
              padding: "12px 0",
              boxShadow:
                selectedItem === "Map"
                  ? "0px 4px 10px rgba(0, 0, 0, 0.1)"
                  : "none",
            }}
          >
            Map
          </Button>
        </ListItem>

        <ListItem sx={{ padding: 0, marginBottom: "15px" }}>
          <Button
            fullWidth
            variant={
              selectedItem === "Prescriptions" ? "contained" : "outlined"
            }
            onClick={() => handleItemClick("Prescriptions")}
            color="secondary"
            sx={{
              textTransform: "none",
              justifyContent: "center",
              fontWeight: "bold",
              borderRadius: "10px",
              padding: "12px 0",
              boxShadow:
                selectedItem === "Prescriptions"
                  ? "0px 4px 10px rgba(0, 0, 0, 0.1)"
                  : "none",
            }}
          >
            Prescriptions
          </Button>
        </ListItem>

        {/* <ListItem sx={{ padding: 0, marginBottom: '15px' }}>
          <Button
            fullWidth
            variant={selectedItem === 'InsuranceRequests' ? 'contained' : 'outlined'}
            onClick={() => handleItemClick('InsuranceRequests')}
            color='secondary'
            sx={{             
              textTransform: 'none',
              justifyContent: 'center',
              fontWeight: 'bold',
              borderRadius: '10px',
              padding: '12px 0',
              boxShadow: selectedItem === 'InsuranceRequests' ? '0px 4px 10px rgba(0, 0, 0, 0.1)' : 'none',
            }}
          >
            Insurance Requests
          </Button>
        </ListItem>
        <ListItem sx={{ padding: 0, marginBottom: '15px' }}>
          <Button
            fullWidth
            variant={selectedItem === 'Scheduling' ? 'contained' : 'outlined'}
            onClick={() => handleItemClick('Scheduling')}
            color='secondary'
            sx={{             
              textTransform: 'none',
              justifyContent: 'center',
              fontWeight: 'bold',
              borderRadius: '10px',
              padding: '12px 0',
              boxShadow: selectedItem === 'Scheduling' ? '0px 4px 10px rgba(0, 0, 0, 0.1)' : 'none',
            }}
          >
            Scheduling
          </Button>
        </ListItem> */}
        <ListItem sx={{ padding: 0, marginBottom: "15px" }}>
          <Button
            fullWidth
            variant={
              selectedItem === "DoctorProfilePage" ? "contained" : "outlined"
            }
            onClick={() => handleItemClick("DoctorProfilePage")}
            color="secondary"
            sx={{
              textTransform: "none",
              justifyContent: "center",
              fontWeight: "bold",
              borderRadius: "10px",
              padding: "12px 0",
              boxShadow:
                selectedItem === "DoctorProfilePage"
                  ? "0px 4px 10px rgba(0, 0, 0, 0.1)"
                  : "none",
            }}
          >
            Account Settings
          </Button>
        </ListItem>
      </List>

      <Button
        variant="contained"
        color="error"
        onClick={handleLogout}
        startIcon={<LogoutIcon />}
        sx={{
          marginTop: "auto",
          width: "100%",
          fontWeight: "bold",
          borderRadius: "10px",
          padding: "12px 0",
          textTransform: "none",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        Logout
      </Button>
    </Drawer>
  );
};

export default SideBar;
