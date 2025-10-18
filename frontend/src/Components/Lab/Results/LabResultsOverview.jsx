import React, { useState, useEffect } from "react";
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
  Alert,
  Box
} from "@mui/material";
import LabStafNav from "../Staff/LabStafNav";

const LabResultsOverview = () => {
  const [patient] = useState({
    name: "Imalka Dharmarathna",
    patientId: "P-1004",
    dateOfBirth: "1995-03-15",
    age: 28
  });

  // Sample lab results data matching your wireframe
  const [labResults] = useState([
    {
      testName: "Glucose",
      result: "115 mg/dL",
      referenceRange: "70-100 mg/dL",
      unit: "mg/dL",
      status: "Critical"
    },
    {
      testName: "Hemoglobin", 
      result: "14.2 g/dL",
      referenceRange: "12-16 g/dL",
      unit: "g/dL",
      status: "Normal"
    },
    {
      testName: "WBC Count",
      result: "12.5 x10³/μL",
      referenceRange: "4-10 x10³/μL",
      unit: "x10³/μL",
      status: "Critical"
    },
    {
      testName: "Creatinine",
      result: "0.9 mg/dL",
      referenceRange: "0.6-1.2 mg/dL",
      unit: "mg/dL",
      status: "Normal"
    },
    {
      testName: "LDL Cholesterol",
      result: "155 mg/dL",
      referenceRange: "<100 mg/dL",
      unit: "mg/dL",
      status: "Critical"
    },
    {
      testName: "Sodium",
      result: "140 mmol/L",
      referenceRange: "135-145 mmol/L",
      unit: "mmol/L",
      status: "Normal"
    },
    {
      testName: "Potassium",
      result: "3.2 mmol/L",
      referenceRange: "3.5-5.0 mmol/L",
      unit: "mmol/L",
      status: "Critical"
    }
  ]);

  // Static chart components (no animation)
  const StaticLineChart = ({ data, title }) => {
    const maxValue = Math.max(...data.values);
    const points = data.values.map((value, index) => {
      const x = (index / (data.values.length - 1)) * 280;
      const y = 120 - (value / maxValue) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <svg width="280" height="140" style={{ border: '1px solid #ddd', borderRadius: '8px' }}>
          <polyline
            fill="none"
            stroke="#2196f3"
            strokeWidth="3"
            points={points}
          />
          {data.values.map((value, index) => {
            const x = (index / (data.values.length - 1)) * 280;
            const y = 120 - (value / maxValue) * 100;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill="#2196f3"
              />
            );
          })}
        </svg>
      </div>
    );
  };

  const StaticBarChart = ({ data, title }) => {
    const maxValue = Math.max(...data.values);
    
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <svg width="280" height="140" style={{ border: '1px solid #ddd', borderRadius: '8px' }}>
          {data.values.map((value, index) => {
            const barWidth = 60;
            const barHeight = (value / maxValue) * 100;
            const x = index * 80 + 30;
            const y = 120 - barHeight;
            
            return (
              <rect
                key={index}
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={`hsl(${120 + index * 60}, 70%, 50%)`}
              />
            );
          })}
        </svg>
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Normal': return 'success';
      case 'Critical': return 'error';
      case 'Abnormal': return 'warning';
      default: return 'default';
    }
  };

  const criticalCount = labResults.filter(result => result.status === 'Critical').length;

  // Sample chart data
  const glucoseData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    values: [95, 105, 110, 108, 115, 115]
  };

  const liverData = {
    labels: ['ALT', 'AST', 'Bilirubin'],
    values: [35, 40, 45]
  };

  return (
    <div className="lab_page_container">
      <LabStafNav />
      <div className="lab_main_content">
        <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: '#333' }}>
          Lab Results Overview - Admin Dashboard
        </Typography>

        {/* Patient Info */}
        <Card style={{ marginBottom: '20px' }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                  {patient.name}
                </Typography>
                <Typography color="textSecondary">
                  Patient ID: {patient.patientId} | DOB: {patient.dateOfBirth} | Age: {patient.age}
                </Typography>
              </Grid>
              <Grid item xs={4} style={{ textAlign: 'right' }}>
                {criticalCount > 0 && (
                  <Chip 
                    label={`${criticalCount} Critical Values`} 
                    color="error" 
                    style={{ fontSize: '14px', fontWeight: 'bold' }}
                  />
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Visual Analysis Charts - Static */}
        <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold', marginBottom: '20px' }}>
          Visual Analysis
        </Typography>

        <Grid container spacing={3} style={{ marginBottom: '30px' }}>
          <Grid item xs={4}>
            <Card style={{ height: '220px' }}>
              <CardContent>
                <StaticLineChart data={glucoseData} title="Glucose Level Trend" />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card style={{ height: '220px' }}>
              <CardContent>
                <StaticBarChart data={liverData} title="Liver Function Panel" />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card style={{ height: '220px' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Result Distribution</Typography>
                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: '50px', height: '50px', backgroundColor: '#4CAF50', borderRadius: '50%', margin: '0 auto 10px' }}></div>
                      <Typography variant="body2">Normal: 57%</Typography>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: '35px', height: '35px', backgroundColor: '#FF9800', borderRadius: '50%', margin: '0 auto 10px' }}></div>
                      <Typography variant="body2">Abnormal: 29%</Typography>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: '25px', height: '25px', backgroundColor: '#F44336', borderRadius: '50%', margin: '0 auto 10px' }}></div>
                      <Typography variant="body2">Critical: 14%</Typography>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Admin Actions */}
        <Card style={{ marginBottom: '20px', backgroundColor: '#e3f2fd' }}>
          <CardContent>
            <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '15px' }}>
              Admin Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item>
                <button 
                  style={{
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginRight: '10px'
                  }}
                >
                  Export All Results
                </button>
              </Grid>
              <Grid item>
                <button 
                  style={{
                    backgroundColor: '#ff9800',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginRight: '10px'
                  }}
                >
                  Send to Doctor
                </button>
              </Grid>
              <Grid item>
                <button 
                  style={{
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Mark as Reviewed
                </button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Detailed Lab Results Table */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <Typography variant="h5" style={{ fontWeight: 'bold' }}>
            Detailed Lab Results
          </Typography>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead style={{ backgroundColor: '#f0f0f0' }}>
              <TableRow>
                <TableCell><strong>TEST NAME</strong></TableCell>
                <TableCell><strong>RESULT</strong></TableCell>
                <TableCell><strong>REFERENCE RANGE</strong></TableCell>
                <TableCell><strong>UNIT</strong></TableCell>
                <TableCell><strong>STATUS</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {labResults.map((result, index) => (
                <TableRow key={index}>
                  <TableCell>{result.testName}</TableCell>
                  <TableCell style={{ 
                    color: result.status === 'Critical' ? '#f44336' : 
                           result.status === 'Abnormal' ? '#ff9800' : '#333',
                    fontWeight: result.status === 'Critical' ? 'bold' : 'normal'
                  }}>
                    {result.result}
                  </TableCell>
                  <TableCell>{result.referenceRange}</TableCell>
                  <TableCell>{result.unit}</TableCell>
                  <TableCell>
                    <Chip 
                      label={result.status} 
                      color={getStatusColor(result.status)}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {criticalCount > 0 && (
          <Alert severity="error" style={{ marginTop: '20px' }}>
            <strong>Critical Alert:</strong> {criticalCount} test result(s) require immediate attention. 
            Please review and take appropriate action.
          </Alert>
        )}
      </div>
    </div>
  );
};

export default LabResultsOverview;