import React from "react";
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
  Button,
  Box,
  Divider
} from "@mui/material";
import LabStafNav from "../Staff/LabStafNav";

const InvoiceDetails = () => {
  const invoiceData = {
    invoiceNumber: "INV-HC-2024-004",
    date: "2024-07-28",
    dueDate: "2024-08-28",
    billedTo: {
      name: "Mr. Imalka Dharmarathna",
      patientId: "P-1001",
      address: "1677, Town Road, Kottegama",
      email: "imalka@123.com"
    },
    serviceProvider: {
      name: "HealthLink Pro Clinic",
      address: "456 High Level Road, Colombo 4",
      email: "billing@healthlinkpro.com",
      phone: "(555) 123-4567"
    },
    services: [
      {
        description: "Consultation - General Practitioner",
        quantity: 1,
        rate: 3500.00,
        amount: 3500.00
      },
      {
        description: "Lab Test - Complete Blood Count (CBC)",
        quantity: 1,
        rate: 2800.00,
        amount: 2800.00
      },
      {
        description: "Prescription Dispensing - Medication X (30 days)",
        quantity: 1,
        rate: 1500.00,
        amount: 1500.00
      },
      {
        description: "Physiotherapy Session - Initial Assessment",
        quantity: 1,
        rate: 4200.00,
        amount: 4200.00
      },
      {
        description: "Minor Procedure - Wound Dressing",
        quantity: 1,
        rate: 1500.00,
        amount: 1500.00
      }
    ],
    paymentInfo: {
      bankName: "HealthLink Financial",
      accountNumber: "Account: 1234 5678 9012 3456",
      swiftCode: "HLFC0318"
    }
  };

  const subtotal = invoiceData.services.reduce((sum, service) => sum + service.amount, 0);
  const taxRate = 0.07; // 7%
  const tax = subtotal * taxRate;
  const discount = 200.00;
  const total = subtotal + tax - discount;

  const handleDownloadInvoice = () => {
    alert("Invoice downloaded successfully!");
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <LabStafNav />
      <div style={{ padding: '20px', marginTop: '60px' }}>
        <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: '#333' }}>
          Invoice Details
        </Typography>

        <Card>
          <CardContent style={{ padding: '40px' }}>
            {/* Header */}
            <Grid container justifyContent="space-between" alignItems="center" style={{ marginBottom: '40px' }}>
              <Grid item>
                <Typography variant="h3" style={{ color: '#1976d2' }}>
                  🏠
                </Typography>
              </Grid>
              <Grid item style={{ textAlign: 'right' }}>
                <Typography variant="h4" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                  INVOICE
                </Typography>
                <Typography><strong>Invoice #:</strong> {invoiceData.invoiceNumber}</Typography>
                <Typography><strong>Date:</strong> {invoiceData.date}</Typography>
                <Typography><strong>Due Date:</strong> {invoiceData.dueDate}</Typography>
              </Grid>
            </Grid>

            {/* Billing Information */}
            <Grid container spacing={4} style={{ marginBottom: '40px' }}>
              <Grid item xs={6}>
                <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '15px' }}>
                  Billed To:
                </Typography>
                <Typography>{invoiceData.billedTo.name}</Typography>
                <Typography>Patient ID: {invoiceData.billedTo.patientId}</Typography>
                <Typography>{invoiceData.billedTo.address}</Typography>
                <Typography>{invoiceData.billedTo.email}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '15px' }}>
                  Service Provider:
                </Typography>
                <Typography>{invoiceData.serviceProvider.name}</Typography>
                <Typography>{invoiceData.serviceProvider.address}</Typography>
                <Typography>{invoiceData.serviceProvider.email}</Typography>
                <Typography>Phone: {invoiceData.serviceProvider.phone}</Typography>
              </Grid>
            </Grid>

            {/* Services Table */}
            <TableContainer component={Paper} style={{ marginBottom: '30px' }}>
              <Table>
                <TableHead style={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell><strong>Service Description</strong></TableCell>
                    <TableCell align="center"><strong>Quantity</strong></TableCell>
                    <TableCell align="right"><strong>Rate</strong></TableCell>
                    <TableCell align="right"><strong>Amount</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoiceData.services.map((service, index) => (
                    <TableRow key={index}>
                      <TableCell>{service.description}</TableCell>
                      <TableCell align="center">{service.quantity}</TableCell>
                      <TableCell align="right">Rs.{service.rate.toFixed(2)}</TableCell>
                      <TableCell align="right">Rs.{service.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Totals */}
            <Grid container justifyContent="flex-end">
              <Grid item xs={4}>
                <Box>
                  <Grid container justifyContent="space-between" style={{ marginBottom: '10px' }}>
                    <Typography>Subtotal:</Typography>
                    <Typography>Rs.{subtotal.toFixed(2)}</Typography>
                  </Grid>
                  <Grid container justifyContent="space-between" style={{ marginBottom: '10px' }}>
                    <Typography>Tax (7%):</Typography>
                    <Typography>Rs.{tax.toFixed(2)}</Typography>
                  </Grid>
                  <Grid container justifyContent="space-between" style={{ marginBottom: '15px' }}>
                    <Typography>Discount:</Typography>
                    <Typography style={{ color: '#4caf50' }}>-Rs.{discount.toFixed(2)}</Typography>
                  </Grid>
                  <Divider style={{ marginBottom: '15px' }} />
                  <Grid container justifyContent="space-between">
                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>Total Due:</Typography>
                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>Rs.{total.toFixed(2)}</Typography>
                  </Grid>
                </Box>
              </Grid>
            </Grid>

            {/* Payment Information */}
            <Box style={{ marginTop: '40px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
              <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '15px' }}>
                Payment Information:
              </Typography>
              <Typography style={{ marginBottom: '5px' }}>
                Please make payment to the following account:
              </Typography>
              <Typography><strong>Bank Name:</strong> {invoiceData.paymentInfo.bankName}</Typography>
              <Typography><strong>{invoiceData.paymentInfo.accountNumber}</strong></Typography>
              <Typography><strong>SWIFT Code:</strong> {invoiceData.paymentInfo.swiftCode}</Typography>
              <Typography style={{ marginTop: '10px', fontStyle: 'italic' }}>
                Payment is due within 30 days of the invoice date.
              </Typography>
            </Box>

            {/* Download Button */}
            <Box display="flex" justifyContent="center" style={{ marginTop: '30px' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleDownloadInvoice}
                style={{ padding: '12px 40px', fontSize: '16px' }}
              >
                📥 Download Invoice
              </Button>
            </Box>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoiceDetails;