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
  Button
} from "@mui/material";
import LabStafNav from "../Staff/LabStafNav";

const BillingManagement = () => {
  const [billingRecords] = useState([
    {
      invoiceId: "INV-001",
      patientName: "Imalka Dharmarathna",
      patientId: "P-1004",
      services: "Lab Tests + Consultation",
      amount: 6750.50,
      status: "Paid",
      date: "2024-07-28"
    },
    {
      invoiceId: "INV-002",
      patientName: "John Doe",
      patientId: "P-1001",
      services: "Complete Blood Count",
      amount: 2800.00,
      status: "Pending",
      date: "2024-07-27"
    },
    {
      invoiceId: "INV-003",
      patientName: "Jane Smith",
      patientId: "P-1002",
      services: "Consultation + Prescription",
      amount: 5000.00,
      status: "Overdue",
      date: "2024-07-25"
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Pending': return 'warning';
      case 'Overdue': return 'error';
      default: return 'default';
    }
  };

  return (
    <div className="lab_page_container">
      <LabStafNav />
      <div className="lab_main_content">
        <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: '#333' }}>
          Billing Management - Admin Dashboard
        </Typography>

        {/* Stats */}
        <Grid container spacing={3} style={{ marginBottom: '30px' }}>
          <Grid item xs={3}>
            <Card style={{ backgroundColor: '#e8f5e8' }}>
              <CardContent style={{ textAlign: 'center' }}>
                <Typography variant="h6">Total Revenue</Typography>
                <Typography variant="h4" style={{ color: '#4caf50', fontWeight: 'bold' }}>
                  Rs. 14,550.50
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card style={{ backgroundColor: '#fff3e0' }}>
              <CardContent style={{ textAlign: 'center' }}>
                <Typography variant="h6">Pending Payments</Typography>
                <Typography variant="h4" style={{ color: '#ff9800', fontWeight: 'bold' }}>
                  Rs. 2,800.00
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card style={{ backgroundColor: '#ffebee' }}>
              <CardContent style={{ textAlign: 'center' }}>
                <Typography variant="h6">Overdue Payments</Typography>
                <Typography variant="h4" style={{ color: '#f44336', fontWeight: 'bold' }}>
                  Rs. 5,000.00
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card style={{ backgroundColor: '#e3f2fd' }}>
              <CardContent style={{ textAlign: 'center' }}>
                <Typography variant="h6">This Month</Typography>
                <Typography variant="h4" style={{ color: '#2196f3', fontWeight: 'bold' }}>
                  Rs. 22,350.50
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Billing Records Table */}
        <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold' }}>
          Recent Billing Records
        </Typography>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead style={{ backgroundColor: '#f0f0f0' }}>
              <TableRow>
                <TableCell><strong>Invoice ID</strong></TableCell>
                <TableCell><strong>Patient Name</strong></TableCell>
                <TableCell><strong>Patient ID</strong></TableCell>
                <TableCell><strong>Services</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {billingRecords.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.invoiceId}</TableCell>
                  <TableCell>{record.patientName}</TableCell>
                  <TableCell>{record.patientId}</TableCell>
                  <TableCell>{record.services}</TableCell>
                  <TableCell>Rs. {record.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={record.status} 
                      color={getStatusColor(record.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      onClick={() => window.location.href = '/billing/invoice/' + record.invoiceId}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default BillingManagement;