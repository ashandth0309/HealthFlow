import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  Button,
  Alert
} from "@mui/material";
import HomeNav from "../../DoctorChanneling/Home/HomeNav";

const ViewLabResults = () => {
  const [email, setEmail] = useState("");
  const [labResults, setLabResults] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Sample lab results data
  const sampleResults = [
    {
      id: 'LR001',
      testDate: '2024-01-15',
      testName: 'Complete Blood Count (CBC)',
      doctor: 'Dr. Smith',
      status: 'Completed',
      results: [
        { parameter: 'Hemoglobin', value: '14.2 g/dL', range: '12-16 g/dL', status: 'Normal' },
        { parameter: 'WBC Count', value: '7.5 x10³/μL', range: '4-10 x10³/μL', status: 'Normal' },
        { parameter: 'Platelets', value: '280 x10³/μL', range: '150-450 x10³/μL', status: 'Normal' }
      ]
    },
    {
      id: 'LR002',
      testDate: '2024-01-10',
      testName: 'Lipid Panel',
      doctor: 'Dr. Johnson',
      status: 'Completed',
      results: [
        { parameter: 'Total Cholesterol', value: '220 mg/dL', range: '<200 mg/dL', status: 'High' },
        { parameter: 'LDL Cholesterol', value: '140 mg/dL', range: '<100 mg/dL', status: 'High' },
        { parameter: 'HDL Cholesterol', value: '45 mg/dL', range: '>40 mg/dL', status: 'Normal' }
      ]
    }
  ];

  const handleViewResults = () => {
    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // In real implementation, filter by patient email from backend
      const patientResults = sampleResults;
      
      if (patientResults.length > 0) {
        setLabResults(patientResults);
        setMessage("");
      } else {
        setLabResults([]);
        setMessage("No lab results found for this email.");
      }
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Normal': return 'success';
      case 'High': case 'Low': return 'warning';
      case 'Critical': return 'error';
      default: return 'default';
    }
  };

  const downloadReport = (resultId) => {
    // Implement PDF download functionality
    alert(`Downloading report for ${resultId}`);
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <HomeNav />
      <div style={{ padding: '20px', marginTop: '60px' }}>
        <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: '#333' }}>
          My Lab Results
        </Typography>

        {/* Email Input */}
        <Card style={{ marginBottom: '20px' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Enter your email to view lab results
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
                  onClick={handleViewResults}
                  disabled={loading}
                  style={{ padding: '15px' }}
                >
                  {loading ? 'Loading...' : 'View Results'}
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

        {/* Lab Results Display */}
        {labResults.length > 0 && (
          <div>
            {labResults.map((result, index) => (
              <Card key={index} style={{ marginBottom: '20px' }}>
                <CardContent>
                  <Grid container justifyContent="space-between" alignItems="center" style={{ marginBottom: '15px' }}>
                    <Grid item>
                      <Typography variant="h6" style={{ fontWeight: 'bold', color: '#1976d2' }}>
                        {result.testName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Test ID: {result.id} | Date: {result.testDate} | Doctor: {result.doctor}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Chip 
                        label={result.status} 
                        color="success" 
                        style={{ marginRight: '10px' }}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => downloadReport(result.id)}
                      >
                        📥 Download
                      </Button>
                    </Grid>
                  </Grid>

                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead style={{ backgroundColor: '#f0f0f0' }}>
                        <TableRow>
                          <TableCell><strong>Parameter</strong></TableCell>
                          <TableCell><strong>Your Result</strong></TableCell>
                          <TableCell><strong>Reference Range</strong></TableCell>
                          <TableCell><strong>Status</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {result.results.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{item.parameter}</TableCell>
                            <TableCell style={{ 
                              fontWeight: item.status !== 'Normal' ? 'bold' : 'normal',
                              color: item.status !== 'Normal' ? '#d32f2f' : 'inherit'
                            }}>
                              {item.value}
                            </TableCell>
                            <TableCell>{item.range}</TableCell>
                            <TableCell>
                              <Chip 
                                label={item.status} 
                                color={getStatusColor(item.status)}
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {result.results.some(r => r.status !== 'Normal') && (
                    <Alert severity="warning" style={{ marginTop: '15px' }}>
                      <strong>Note:</strong> Some values are outside the normal range. 
                      Please consult with your doctor for proper interpretation and follow-up.
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewLabResults;