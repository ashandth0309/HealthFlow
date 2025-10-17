import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Search,
  Visibility,
  VideoCall,
  LocalHospital,
  Phone,
  Email,
} from "@mui/icons-material";
import Sidebar from "./SideBar";
import { useNavigate } from "react-router-dom";

const PatientsPage = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  useEffect(() => {
    // Mock patient data
    const mockPatients = [
      {
        id: 1,
        name: "Maini Bandara",
        dob: "1986-07-21",
        age: 38,
        gender: "Female",
        phone: "(555) 123-4567",
        email: "maini.bandara@example.com",
        lastVisit: "2024-03-15",
        conditions: ["Hypertension", "Bronchitis"],
        allergies: ["Penicillin"],
        status: "active"
      },
      {
        id: 2,
        name: "Aisha Khan",
        dob: "1979-05-15",
        age: 45,
        gender: "Female",
        phone: "(555) 987-6543",
        email: "aisha.khan@example.com",
        lastVisit: "2024-03-14",
        conditions: ["Hypertension"],
        allergies: ["Sulfa Drugs"],
        status: "active"
      },
      {
        id: 3,
        name: "Jane Doe",
        dob: "1990-12-01",
        age: 33,
        gender: "Female",
        phone: "(555) 456-7890",
        email: "jane.doe@example.com",
        lastVisit: "2024-03-10",
        conditions: ["Renal Impairment"],
        allergies: ["Penicillin"],
        status: "active"
      }
    ];
    setPatients(mockPatients);
  }, []);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewMedicalRecord = (patient) => {
    navigate('/PatientMedicalRecord', { state: { patient } });
  };

  const handleStartTelemedicine = (patient) => {
    navigate('/TelemedicineConsultation', { state: { patient } });
  };

  const handleContactPatient = (patient) => {
    setSelectedPatient(patient);
    setContactDialogOpen(true);
  };

  const handleCallPatient = (phone) => {
    window.open(`tel:${phone}`);
  };

  const handleEmailPatient = (email) => {
    window.open(`mailto:${email}`);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      
      <Box sx={{ flexGrow: 1, p: 3, backgroundColor: "#f5f5f5" }}>
        <Typography variant="h4" gutterBottom>
          Patients
        </Typography>
        
        {/* Search Bar */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search patients by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
              }}
            />
          </CardContent>
        </Card>

        {/* Patients Grid */}
        <Grid container spacing={3}>
          {filteredPatients.map((patient) => (
            <Grid item xs={12} md={6} key={patient.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar sx={{ width: 60, height: 60, mr: 2 }}>
                      {patient.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{patient.name}</Typography>
                      <Typography color="textSecondary">
                        {patient.age} years • {patient.gender}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Phone:</strong> {patient.phone}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Email:</strong> {patient.email}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Last Visit:</strong> {patient.lastVisit}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Conditions:</strong>
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {patient.conditions.map((condition, index) => (
                        <Chip
                          key={index}
                          label={condition}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Allergies:</strong>
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {patient.allergies.map((allergy, index) => (
                        <Chip
                          key={index}
                          label={allergy}
                          size="small"
                          color="error"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => handleViewMedicalRecord(patient)}
                    >
                      Records
                    </Button>
                    <Button
                      size="small"
                      startIcon={<VideoCall />}
                      onClick={() => handleStartTelemedicine(patient)}
                    >
                      Telemedicine
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Phone />}
                      onClick={() => handleContactPatient(patient)}
                    >
                      Contact
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Contact Dialog */}
        <Dialog open={contactDialogOpen} onClose={() => setContactDialogOpen(false)}>
          <DialogTitle>Contact Patient</DialogTitle>
          <DialogContent>
            {selectedPatient && (
              <Box>
                <Typography variant="body1" gutterBottom>
                  <strong>Name:</strong> {selectedPatient.name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Phone:</strong> {selectedPatient.phone}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {selectedPatient.email}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setContactDialogOpen(false)}>Cancel</Button>
            <Button 
              startIcon={<Phone />}
              onClick={() => handleCallPatient(selectedPatient?.phone)}
              variant="contained"
            >
              Call
            </Button>
            <Button 
              startIcon={<Email />}
              onClick={() => handleEmailPatient(selectedPatient?.email)}
              variant="outlined"
            >
              Email
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default PatientsPage;