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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Person,
  CalendarToday,
  Phone,
  Email,
  MedicalServices,
  VideoCall,
  Add,
  MeetingRoom,
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

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [consultationDate, setConsultationDate] = useState("");
  const [consultationTime, setConsultationTime] = useState("");
  const [doctorName, setDoctorName] = useState("");

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
        }
      } 
    });
  };

  const handleStartInPersonConsultation = () => {
    setConsultationDate("");
    setConsultationTime("");
    setDoctorName("");
    setConfirmDialogOpen(true);
  };

  const confirmInPersonConsultation = () => {
    if (!consultationDate || !consultationTime || !doctorName) {
      alert("Please fill all the required fields");
      return;
    }

    // Create consultation data
    const consultationData = {
      patient: patient,
      type: "In-Person Consultation",
      doctor: doctorName,
      date: consultationDate,
      time: consultationTime,
      timestamp: new Date().toLocaleString(),
      status: "Scheduled",
      scheduledDate: new Date(consultationDate).toLocaleDateString(),
      scheduledTime: consultationTime,
    };

    // Store consultation data
    const existingConsultations = JSON.parse(localStorage.getItem('consultations') || '[]');
    existingConsultations.push(consultationData);
    localStorage.setItem('consultations', JSON.stringify(existingConsultations));

    // Close dialog and navigate to staff dashboard
    setConfirmDialogOpen(false);
    navigate('/staffdash', { 
      state: { 
        consultation: consultationData,
        message: `In-person consultation scheduled for ${patient.name} with ${doctorName} on ${consultationDate} at ${consultationTime}`
      } 
    });
  };

  const cancelInPersonConsultation = () => {
    setConfirmDialogOpen(false);
  };

  // Generate time slots
  const generateTimeSlots = () => {
    const times = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const timeSlots = generateTimeSlots();

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
                    variant="contained"
                    startIcon={<MeetingRoom />}
                    onClick={handleStartInPersonConsultation}
                    fullWidth
                    sx={{ 
                      backgroundColor: "#2e7d32",
                      '&:hover': {
                        backgroundColor: "#1b5e20",
                      }
                    }}
                  >
                    Start In-Person Consultation
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

        {/* Consultation Form Dialog */}
        <Dialog
          open={confirmDialogOpen}
          onClose={cancelInPersonConsultation}
          aria-labelledby="consultation-dialog-title"
          maxWidth="md"
          fullWidth
        >
          <DialogTitle id="consultation-dialog-title">
            Schedule In-Person Consultation
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 3 }}>
              Please schedule the in-person consultation for the patient.
            </DialogContentText>

            {/* Patient Information Display */}
            <Card sx={{ mb: 3, backgroundColor: '#f8f9fa' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Patient Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Name:</strong> {patient.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Age:</strong> {patient.age} years
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Phone:</strong> {patient.phone}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Email:</strong> {patient.email}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Consultation Form */}
            <Box component="form" sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Consultation Date"
                    type="date"
                    value={consultationDate}
                    onChange={(e) => setConsultationDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      min: new Date().toISOString().split('T')[0]
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Consultation Time</InputLabel>
                    <Select
                      value={consultationTime}
                      label="Consultation Time"
                      onChange={(e) => setConsultationTime(e.target.value)}
                    >
                      {timeSlots.map((time) => (
                        <MenuItem key={time} value={time}>
                          {time}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Doctor Name"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="Enter doctor's name"
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelInPersonConsultation} color="primary">
              Cancel
            </Button>
            <Button 
              onClick={confirmInPersonConsultation} 
              color="primary" 
              variant="contained"
              disabled={!consultationDate || !consultationTime || !doctorName}
            >
              Schedule Consultation
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default PatientMedicalRecord;