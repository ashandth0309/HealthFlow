import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Paper,
  Chip,
  Divider,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  VideoCall,
  Person,
  Warning,
  Description,
  Send,
} from "@mui/icons-material";
import Sidebar from "./SideBar";
import { useLocation } from "react-router-dom";

const TelemedicineConsultation = () => {
  const location = useLocation();
  const [patient, setPatient] = useState(null);
  const [soapNotes, setSoapNotes] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: ""
  });
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (location.state?.patient) {
      setPatient(location.state.patient);
    } else {
      // Default patient for demo
      setPatient({
        name: "Aisha Khan",
        age: 45,
        gender: "Female",
        id: "A812345C",
        allergies: ["Penicillin"],
        conditions: ["Hypertension (controlled)"]
      });
    }
  }, [location]);

  const handleSoapChange = (section, value) => {
    setSoapNotes(prev => ({
      ...prev,
      [section]: value
    }));
  };

  const handleNextStep = () => {
    setActiveStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSaveNotes = () => {
    // Save SOAP notes logic here
    console.log("SOAP Notes saved:", soapNotes);
    alert("Consultation notes saved successfully!");
  };

  const steps = ['Patient Info', 'SOAP Notes', 'Prescription', 'Summary'];

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      
      <Box sx={{ flexGrow: 1, p: 3, backgroundColor: "#f5f5f5" }}>
        <Typography variant="h4" gutterBottom>
          Telemedicine Consultation
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Grid container spacing={3}>
          {/* Patient Details */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <VideoCall sx={{ mr: 1 }} />
                  Live Session
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Patient:</strong> {patient.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Age: {patient.age} years • Gender: {patient.gender}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Patient ID: {patient.id}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Critical Alerts */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Warning sx={{ mr: 1, color: 'error.main' }} />
                    Critical Alerts
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Chip 
                      label={`Allergy: ${patient.allergies?.join(', ')}`} 
                      color="error" 
                      size="small" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={`Condition: ${patient.conditions?.join(', ')}`} 
                      color="warning" 
                      size="small" 
                      variant="outlined" 
                    />
                  </Box>
                </Box>

                {/* Video Call Interface */}
                <Box sx={{ mt: 3, p: 2, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
                  <Typography variant="body2" gutterBottom align="center">
                    Video Call Interface
                  </Typography>
                  <Box sx={{ 
                    height: 200, 
                    backgroundColor: '#bbdefb', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    borderRadius: 1,
                    mb: 2
                  }}>
                    <Typography color="textSecondary">
                      Video Feed
                    </Typography>
                  </Box>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    startIcon={<VideoCall />}
                  >
                    Start Video Call
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Consultation Notes */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Description sx={{ mr: 1 }} />
                  Consultation Notes (SOAP)
                </Typography>

                {activeStep === 1 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                      label="Subjective"
                      multiline
                      rows={3}
                      fullWidth
                      value={soapNotes.subjective}
                      onChange={(e) => handleSoapChange('subjective', e.target.value)}
                      placeholder="Patient reports general fatigue and intermittent headaches over the past week."
                    />
                    
                    <TextField
                      label="Objective"
                      multiline
                      rows={3}
                      fullWidth
                      value={soapNotes.objective}
                      onChange={(e) => handleSoapChange('objective', e.target.value)}
                      placeholder="Vital signs normal. No visible signs of acute distress."
                    />
                    
                    <TextField
                      label="Assessment"
                      multiline
                      rows={3}
                      fullWidth
                      value={soapNotes.assessment}
                      onChange={(e) => handleSoapChange('assessment', e.target.value)}
                      placeholder="Likely viral syndrome. Consider differential for tension headaches."
                    />
                    
                    <TextField
                      label="Plan"
                      multiline
                      rows={3}
                      fullWidth
                      value={soapNotes.plan}
                      onChange={(e) => handleSoapChange('plan', e.target.value)}
                      placeholder="Recommend rest, hydration, and over-the-counter pain relief."
                    />
                  </Box>
                )}

                {activeStep === 3 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>Consultation Summary</Typography>
                    <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                      <Typography><strong>Subjective:</strong> {soapNotes.subjective}</Typography>
                      <Typography><strong>Objective:</strong> {soapNotes.objective}</Typography>
                      <Typography><strong>Assessment:</strong> {soapNotes.assessment}</Typography>
                      <Typography><strong>Plan:</strong> {soapNotes.plan}</Typography>
                    </Paper>
                  </Box>
                )}

                {/* Navigation Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handlePrevStep}
                  >
                    Back
                  </Button>
                  
                  {activeStep === steps.length - 1 ? (
                    <Button 
                      variant="contained" 
                      onClick={handleSaveNotes}
                      startIcon={<Send />}
                    >
                      Complete Consultation
                    </Button>
                  ) : (
                    <Button variant="contained" onClick={handleNextStep}>
                      Next
                    </Button>
                  )}
                </Box>

                {/* Next Steps */}
                {activeStep === steps.length - 1 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Next Steps
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Button variant="outlined">Digital Prescription</Button>
                      <Button variant="outlined">Diagnostic Test Ordering</Button>
                      <Button variant="outlined">Specialist Referral</Button>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default TelemedicineConsultation;