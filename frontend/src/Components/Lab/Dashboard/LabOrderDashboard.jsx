import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import LabStafNav from "../Staff/LabStafNav";

const LabOrderDashboard = () => {
  const [labOrders, setLabOrders] = useState([]);
  const [stats, setStats] = useState({
    pending: 12,
    processing: 5,
    completed: 28,
    alerts: 3
  });

  // Sample data matching your wireframe
  const sampleOrders = [
    {
      patientId: "P-1001",
      testName: "Complete Blood Count",
      orderDate: "2024-07-28",
      status: "Processing",
      progress: 65,
      analyzer: "Blood Analyzer A1"
    },
    {
      patientId: "P-1002", 
      testName: "Urinalysis",
      orderDate: "2024-07-28",
      status: "Pending",
      progress: 10,
      analyzer: "Urine Analyzer B2"
    },
    {
      patientId: "P-1003",
      testName: "Biopsy Sample Analysis", 
      orderDate: "2024-07-27",
      status: "Completed",
      progress: 100,
      analyzer: "Tissue Processor C3"
    },
    {
      patientId: "P-1004",
      testName: "Thyroid Function Test",
      orderDate: "2024-07-26", 
      status: "Processing",
      progress: 80,
      analyzer: "Immuno Assay D4"
    },
    {
      patientId: "P-1005",
      testName: "Glucose Level",
      orderDate: "2024-07-25",
      status: "Completed", 
      progress: 100,
      analyzer: "Blood Analyzer A1"
    },
    {
      patientId: "P-1006",
      testName: "Cholesterol Panel",
      orderDate: "2024-07-25",
      status: "Pending",
      progress: 0,
      analyzer: "Blood Analyzer A1"
    },
    {
      patientId: "P-1007",
      testName: "Liver Function Test",
      orderDate: "2024-07-24",
      status: "Rejected",
      progress: 0,
      analyzer: "Urine Analyzer B2"
    }
  ];

  useEffect(() => {
    setLabOrders(sampleOrders);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Processing': return 'info';
      case 'Completed': return 'success';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  const recentActivity = [
    "10:30 AM: Order P-1001 status updated to 'Processing'",
    "09:45 AM: New lab order P-1007 created for Urinalysis", 
    "08:15 AM: Analyzer A1 calibration successful",
    "Yesterday: Order P-1003 results uploaded"
  ];

  return (
    <div style={{ display: 'flex' }}>
      <LabStafNav />
      <div className="lab_main_content">
        <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: '#333' }}>
          Lab Order Dashboard
        </Typography>
        
        {/* Stats Cards */}
        <Grid container spacing={3} style={{ marginBottom: '30px' }}>
          <Grid item xs={3}>
            <Card style={{ background: 'linear-gradient(135deg, #ff9800, #ffb74d)' }}>
              <CardContent style={{ textAlign: 'center', color: 'white' }}>
                <Typography variant="h6">Pending Orders</Typography>
                <Typography variant="h2" style={{ fontWeight: 'bold' }}>
                  {stats.pending}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card style={{ background: 'linear-gradient(135deg, #2196f3, #64b5f6)' }}>
              <CardContent style={{ textAlign: 'center', color: 'white' }}>
                <Typography variant="h6">Processing Orders</Typography>
                <Typography variant="h2" style={{ fontWeight: 'bold' }}>
                  {stats.processing}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card style={{ background: 'linear-gradient(135deg, #4caf50, #81c784)' }}>
              <CardContent style={{ textAlign: 'center', color: 'white' }}>
                <Typography variant="h6">Completed Today</Typography>
                <Typography variant="h2" style={{ fontWeight: 'bold' }}>
                  {stats.completed}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card style={{ background: 'linear-gradient(135deg, #f44336, #ef5350)' }}>
              <CardContent style={{ textAlign: 'center', color: 'white' }}>
                <Typography variant="h6">Priority Alerts</Typography>
                <Typography variant="h2" style={{ fontWeight: 'bold' }}>
                  {stats.alerts}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filter Section */}
        <Card style={{ marginBottom: '20px', padding: '15px' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Typography variant="h6">Filter Orders:</Typography>
            </Grid>
            <Grid item>
              <Chip label="Blood Analyzer A1" variant="outlined" />
            </Grid>
            <Grid item>
              <Typography>September 5th, 2025</Typography>
            </Grid>
            <Grid item>
              <Chip label="All Statuses" variant="outlined" />
            </Grid>
          </Grid>
        </Card>

        {/* Active Lab Orders Table */}
        <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold' }}>
          Active Lab Orders
        </Typography>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead style={{ backgroundColor: '#f0f0f0' }}>
              <TableRow>
                <TableCell><strong>Patient ID</strong></TableCell>
                <TableCell><strong>Test Name</strong></TableCell>
                <TableCell><strong>Order Date</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Progress</strong></TableCell>
                <TableCell><strong>Analyzer</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {labOrders.map((order, index) => (
                <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#fafafa' : 'white' }}>
                  <TableCell>{order.patientId}</TableCell>
                  <TableCell>{order.testName}</TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>
                    <Chip 
                      label={order.status} 
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={order.progress} 
                        style={{ width: '100px' }}
                      />
                      <Typography variant="caption">{order.progress}%</Typography>
                    </div>
                  </TableCell>
                  <TableCell>{order.analyzer}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Recent Activity */}
        <Card style={{ marginTop: '20px' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Recent Activity</Typography>
            {recentActivity.map((activity, index) => (
              <Typography key={index} variant="body2" style={{ marginBottom: '5px' }}>
                • {activity}
              </Typography>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LabOrderDashboard;