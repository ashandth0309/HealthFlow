import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
  Chip,
  Divider,
  Paper
} from "@mui/material";
import HomeNav from "../../DoctorChanneling/Home/HomeNav";

const ViewPrescriptions = () => {
  const [email, setEmail] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Sample prescription data
  const samplePrescriptions = [
    {
      id: 'RX001',
      date: '2024-01-15',
      doctorName: 'Dr. Smith',
      patientName: 'John Doe',
      medications: [
        {
          name: 'Amoxicillin',
          dosage: '500mg',
          frequency: '3 times daily',
          duration: '7 days',
          instructions: 'Take with food'
        },
        {
          name: 'Paracetamol',
          dosage: '650mg',
          frequency: 'As needed',
          duration: '5 days',
          instructions: 'For fever and pain relief'
        }
      ],
      diagnosis: 'Upper Respiratory Tract Infection',
      notes: 'Complete the full course of antibiotics. Return if symptoms worsen.',
      status: 'Active'
    },
    {
      id: 'RX002',
      date: '2024-01-08',
      doctorName: 'Dr. Johnson',
      patientName: 'John Doe',
      medications: [
        {
          name: 'Metformin',
          dosage: '850mg',
          frequency: '2 times daily',
          duration: '30 days',
          instructions: 'Take with meals'
        }
      ],
      diagnosis: 'Type 2 Diabetes Management',
      notes: 'Monitor blood sugar levels regularly. Follow up in 4 weeks.',
      status: 'Completed'
    }
  ];

  const handleViewPrescriptions = () => {
    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // In real implementation, filter by patient email from backend
      const patientPrescriptions = samplePrescriptions;
      
      if (patientPrescriptions.length > 0) {
        setPrescriptions(patientPrescriptions);
        setMessage("");
      } else {
        setPrescriptions([]);
        setMessage("No prescriptions found for this email.");
      }
      setLoading(false);
    }, 1000);
  };

  const downloadPrescription = (prescriptionId) => {
    // Implement PDF download functionality
    alert(`Downloading prescription ${prescriptionId}`);
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <HomeNav />
      <div style={{ padding: '20px', marginTop: '60px' }}>
        <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: '#333' }}>
          My Prescriptions
        </Typography>

        {/* Email Input */}
        <Card style={{ marginBottom: '20px' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Enter your email to view prescriptions
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleViewPrescriptions}
                  disabled={loading}
                  style={{ padding: '15px' }}
                >
                  {loading ? 'Loading...' : 'View Prescriptions'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Message Display */}
        {message && (
          <Alert severity="info" style={{ marginBottom: '20px' }}>
            {message}
          </Alert>
        )}

        {/* Prescriptions Display */}
        {prescriptions.length > 0 && (
          <div>
            {prescriptions.map((prescription, index) => (
              <Card key={index} style={{ marginBottom: '20px' }}>
                <CardContent>
                  {/* Header */}
                  <Grid container justifyContent="space-between" alignItems="center" style={{ marginBottom: '20px' }}>
                    <Grid item>
                      <Typography variant="h6" style={{ fontWeight: 'bold', color: '#1976d2' }}>
                        Prescription #{prescription.id}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Date: {prescription.date} | Doctor: {prescription.doctorName}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Chip 
                        label={prescription.status} 
                        color={prescription.status === 'Active' ? 'success' : 'default'}
                        style={{ marginRight: '10px' }}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => downloadPrescription(prescription.id)}
                      >
                        📥 Download
                      </Button>
                    </Grid>
                  </Grid>

                  {/* Patient and Diagnosis Info */}
                  <Paper style={{ padding: '15px', marginBottom: '20px', backgroundColor: '#f9f9f9' }}>
                    <Typography variant="subtitle1" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                      Patient: {prescription.patientName}
                    </Typography>
                    <Typography variant="body2" style={{ marginBottom: '10px' }}>
                      <strong>Diagnosis:</strong> {prescription.diagnosis}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Doctor's Notes:</strong> {prescription.notes}
                    </Typography>
                  </Paper>

                  {/* Medications */}
                  <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '15px' }}>
                    📋 Medications Prescribed
                  </Typography>

                  {prescription.medications.map((medication, medIndex) => (
                    <Paper key={medIndex} style={{ padding: '15px', marginBottom: '10px', border: '1px solid #e0e0e0' }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                          <Typography variant="subtitle1" style={{ fontWeight: 'bold', color: '#1976d2' }}>
                            {medication.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {medication.dosage}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography variant="body2">
                            <strong>Frequency:</strong><br />
                            {medication.frequency}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <Typography variant="body2">
                            <strong>Duration:</strong><br />
                            {medication.duration}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2">
                            <strong>Instructions:</strong><br />
                            {medication.instructions}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}

                  <Divider style={{ margin: '20px 0' }} />

                  {/* Action Buttons */}
                  <Grid container spacing={2}>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => window.location.href = '/addorder'}
                      >
                        🏥 Order from Pharmacy
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        onClick={() => window.location.href = '/SessionDetails'}
                      >
                        📅 Book Follow-up
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPrescriptions;