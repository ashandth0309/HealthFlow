import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import {
  Person,
  CalendarToday,
  Phone,
  Email,
  MedicalServices,
  VideoCall,
  Add,
} from "@mui/icons-material";
import Sidebar from "./SideBar";
import { useLocation, useNavigate } from "react-router-dom";

const PatientMedicalRecord = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [patient] = useState(location.state?.patient || {
    name: "Maini Bandara",
    dob: "1986-07-21",
    age: 38,
    gender: "Female",
    phone: "(555) 123-4567",
    email: "maini.bandara@example.com",
    lastVisit: "2024-03-15"
  });

  const visitHistory = [
    {
      date: "2024-03-15",
      reason: "Annual physical exam",
      diagnosis: "Healthy, routine check-up",
      doctor: "Dr. Emily White"
    },
    {
      date: "2023-11-22",
      reason: "Persistent cough and fatigue",
      diagnosis: "Bronchitis",
      doctor: "Dr. David Green"
    },
    {
      date: "2023-05-10",
      reason: "Follow-up on blood pressure",
      diagnosis: "Hypertension (controlled)",
      doctor: "Dr. Emily White"
    }
  ];

  const handleStartTelemedicine = () => {
    navigate('/TelemedicineConsultation', { state: { patient } });
  };

  const handleAddPrescription = () => {
    navigate('/PrescriptionForm', { 
      state: { 
        patient: {
          name: patient.name,
          dob: patient.dob,
          age: patient.age,
          gender: patient.gender,
          phone: patient.phone,
          email: patient.email,
          // Include any other relevant patient data for the prescription form
        }
      } 
    });
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      
      <Box sx={{ flexGrow: 1, p: 3, backgroundColor: "#f5f5f5" }}>
        <Typography variant="h4" gutterBottom>
          Medical Record - {patient.name}
        </Typography>

        <Grid container spacing={3}>
          {/* Patient Information */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 1 }} />
                  Patient Information
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Name:</strong> {patient.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                    DOB: {patient.dob} ({patient.age} years)
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Gender:</strong> {patient.gender}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Phone sx={{ fontSize: 16, mr: 0.5 }} />
                    {patient.phone}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Email sx={{ fontSize: 16, mr: 0.5 }} />
                    {patient.email}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<VideoCall />}
                    onClick={handleStartTelemedicine}
                    fullWidth
                  >
                    Start Telemedicine
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleAddPrescription}
                    fullWidth
                    sx={{ mt: 1 }}
                  >
                    Add Prescription
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Medical Conditions */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <MedicalServices sx={{ mr: 1 }} />
                  Medical Conditions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Chip label="Hypertension (controlled)" color="primary" variant="outlined" />
                  <Chip label="Bronchitis (resolved)" color="secondary" variant="outlined" />
                </Box>
              </CardContent>
            </Card>

            {/* Allergies */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Allergies
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Chip label="Penicillin" color="error" variant="outlined" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Visit History */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Visit History
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Reason for Visit</TableCell>
                        <TableCell>Diagnosis</TableCell>
                        <TableCell>Doctor</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {visitHistory.map((visit, index) => (
                        <TableRow key={index}>
                          <TableCell>{visit.date}</TableCell>
                          <TableCell>{visit.reason}</TableCell>
                          <TableCell>{visit.diagnosis}</TableCell>
                          <TableCell>{visit.doctor}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>

            {/* Current Medications */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Current Medications
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Medication</TableCell>
                        <TableCell>Dosage</TableCell>
                        <TableCell>Frequency</TableCell>
                        <TableCell>Prescribed Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Lisinopril</TableCell>
                        <TableCell>10mg</TableCell>
                        <TableCell>Once daily</TableCell>
                        <TableCell>2023-05-10</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Atorvastatin</TableCell>
                        <TableCell>20mg</TableCell>
                        <TableCell>Once daily</TableCell>
                        <TableCell>2023-05-10</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PatientMedicalRecord;