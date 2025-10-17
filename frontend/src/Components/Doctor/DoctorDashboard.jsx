import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  AccessTime,
  Person,
  Notifications,
  LocalHospital,
  VideoCall,
  PersonAdd,
} from "@mui/icons-material";
import Sidebar from "./SideBar";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDoctorData = () => {
      try {
        const doctorData = JSON.parse(sessionStorage.getItem("doctor"));
        
        if (!doctorData) {
          setError("No doctor data found. Please login again.");
          setLoading(false);
          return;
        }

        setDoctor(doctorData);
        
        // Mock data for appointments
        setAppointments([
          {
            id: 1,
            patientName: "Akila Tharanga",
            time: "10:00 AM",
            status: "upcoming",
            type: "in-person"
          },
          {
            id: 2,
            patientName: "Malmi Bandara",
            time: "11:30 AM",
            status: "in-progress",
            type: "in-person"
          },
          {
            id: 3,
            patientName: "Dishni Gunasekara",
            time: "02:30 PM",
            status: "completed",
            type: "telemedicine"
          },
          {
            id: 4,
            patientName: "Michael Perera",
            time: "01:00 PM",
            status: "scheduled",
            type: "in-person"
          },
          {
            id: 5,
            patientName: "Nick Fernando",
            time: "04:00 PM",
            status: "new",
            type: "telemedicine"
          }
        ]);
        
        setLoading(false);
      } catch (err) {
        setError("Error loading doctor data");
        setLoading(false);
      }
    };

    // Simulate loading delay
    setTimeout(loadDoctorData, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'upcoming': return 'primary';
      case 'new': return 'secondary';
      default: return 'default';
    }
  };

  const startConsultation = (appointment) => {
    if (appointment.type === 'telemedicine') {
      navigate('/TelemedicineConsultation', { state: { appointment } });
    } else {
      navigate('/PatientMedicalRecord', { state: { appointment } });
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading Doctor Dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh", justifyContent: "center", alignItems: "center" }}>
        <Alert severity="error" sx={{ maxWidth: 400 }}>
          <Typography variant="h6" gutterBottom>
            Access Denied
          </Typography>
          <Typography>{error}</Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={() => navigate("/DoctorLogin")}
          >
            Go to Login
          </Button>
        </Alert>
      </Box>
    );
  }

  // Main dashboard
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      
      <Box sx={{ flexGrow: 1, p: 3, backgroundColor: "#f5f5f5" }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Doctor's Dashboard
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Welcome back, Dr. {doctor.firstName} {doctor.lastName}
          </Typography>
        </Box>

        {/* Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTime sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Upcoming Appointments
                    </Typography>
                    <Typography variant="h5">7</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 2, color: 'success.main' }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Patients Today
                    </Typography>
                    <Typography variant="h5">3</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Notifications sx={{ mr: 2, color: 'warning.main' }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Unread Notifications
                    </Typography>
                    <Typography variant="h5">2</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocalHospital sx={{ mr: 2, color: 'info.main' }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Prescriptions Issued
                    </Typography>
                    <Typography variant="h5">12</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Today's Schedule */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Today's Schedule
                </Typography>
                <List>
                  {appointments.map((appointment) => (
                    <ListItem
                      key={appointment.id}
                      secondaryAction={
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => startConsultation(appointment)}
                          startIcon={appointment.type === 'telemedicine' ? <VideoCall /> : <PersonAdd />}
                        >
                          {appointment.type === 'telemedicine' ? 'Start Video Call' : 'View Details'}
                        </Button>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          {appointment.patientName.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={appointment.patientName}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                            <Typography variant="body2" color="textSecondary">
                              Time: {appointment.time}
                            </Typography>
                            <Chip
                              label={appointment.status}
                              color={getStatusColor(appointment.status)}
                              size="small"
                              sx={{ ml: 2 }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<VideoCall />}
                    onClick={() => navigate('/TelemedicineConsultation')}
                  >
                    Start Telemedicine
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<LocalHospital />}
                    onClick={() => navigate('/PrescriptionForm')}
                  >
                    Write Prescription
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Person />}
                    onClick={() => navigate('/PatientsPage')}
                  >
                    View All Patients
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DoctorDashboard;