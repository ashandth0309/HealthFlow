import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import LabStafNav from "../Staff/LabStafNav";

const PaymentCenter = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('visa');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '4761 2222 1234 4443',
    expirationDate: '12/26',
    cvv: '123',
    cardholderName: 'Patient Name',
    addressLine1: '456 Elm Street',
    city: 'Springfield',
    zipCode: '56789',
    country: 'United States'
  });

  const paymentMethods = [
    { id: 'visa', name: 'Visa', icon: '💳' },
    { id: 'mastercard', name: 'MasterCard', icon: '💳' },
    { id: 'insurance', name: 'Insurance claim', icon: '🏥' },
    { id: 'government', name: 'Government covered', icon: '🏛️' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePayment = () => {
    setPaymentSuccess(true);
  };

  const handleDownloadReceipt = () => {
    alert("Receipt downloaded successfully!");
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <LabStafNav />
      <div style={{ padding: '20px', marginTop: '60px' }}>
        <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: '#333' }}>
          Payment Center
        </Typography>

        {!paymentSuccess ? (
          <>
            {/* Payment Method Selection */}
            <Typography variant="h6" gutterBottom style={{ marginBottom: '20px' }}>
              Select Payment Method
            </Typography>
            
            <Grid container spacing={2} style={{ marginBottom: '30px' }}>
              {paymentMethods.map((method) => (
                <Grid item xs={3} key={method.id}>
                  <Card
                    style={{
                      cursor: 'pointer',
                      border: selectedPaymentMethod === method.id ? '2px solid #1976d2' : '1px solid #ddd',
                      backgroundColor: selectedPaymentMethod === method.id ? '#e3f2fd' : 'white'
                    }}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <CardContent style={{ textAlign: 'center', padding: '20px' }}>
                      <Typography variant="h4" style={{ marginBottom: '10px' }}>
                        {method.icon}
                      </Typography>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        {method.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Payment Form */}
            {(selectedPaymentMethod === 'visa' || selectedPaymentMethod === 'mastercard') && (
              <Card style={{ marginBottom: '20px' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }}>
                    Secure Payment Details
                  </Typography>

                  {/* Credit Card Information */}
                  <Typography variant="subtitle1" style={{ marginTop: '20px', marginBottom: '15px', fontWeight: 'bold' }}>
                    Credit Card Information
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Card Number"
                        fullWidth
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Expiration Date"
                        fullWidth
                        value={formData.expirationDate}
                        onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="CVV"
                        fullWidth
                        value={formData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Cardholder Name"
                        fullWidth
                        value={formData.cardholderName}
                        onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>

                  {/* Billing Address */}
                  <Typography variant="subtitle1" style={{ marginTop: '30px', marginBottom: '15px', fontWeight: 'bold' }}>
                    Billing Address
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Address Line 1"
                        fullWidth
                        value={formData.addressLine1}
                        onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="City"
                        fullWidth
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="ZIP Code"
                        fullWidth
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Country</InputLabel>
                        <Select
                          value={formData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          label="Country"
                        >
                          <MenuItem value="United States">United States</MenuItem>
                          <MenuItem value="Sri Lanka">Sri Lanka</MenuItem>
                          <MenuItem value="India">India</MenuItem>
                          <MenuItem value="Canada">Canada</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handlePayment}
                    style={{
                      marginTop: '30px',
                      backgroundColor: '#1976d2',
                      padding: '15px',
                      fontSize: '18px',
                      fontWeight: 'bold'
                    }}
                  >
                    Pay Now
                  </Button>
                </CardContent>
              </Card>
            )}

            {selectedPaymentMethod === 'insurance' && (
              <Alert severity="info" style={{ marginBottom: '20px' }}>
                Please provide your insurance card details to process the claim.
              </Alert>
            )}

            {selectedPaymentMethod === 'government' && (
              <Alert severity="info" style={{ marginBottom: '20px' }}>
                This service is covered under government healthcare program.
              </Alert>
            )}
          </>
        ) : (
          /* Payment Success Screen */
          <Card>
            <CardContent style={{ textAlign: 'center', padding: '40px' }}>
              <Typography variant="h2" style={{ color: '#4caf50', marginBottom: '20px' }}>
                ✓
              </Typography>
              <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: '#4caf50' }}>
                Payment Successful!
              </Typography>
              <Typography variant="body1" style={{ marginBottom: '30px', color: '#666' }}>
                Your transaction has been processed successfully.<br />
                A digital receipt preview is below.
              </Typography>

              {/* Digital Receipt Preview */}
              <Card style={{ maxWidth: '400px', margin: '0 auto', backgroundColor: '#f9f9f9' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }}>
                    Digital Receipt Preview
                  </Typography>
                  <Box style={{ textAlign: 'left', marginTop: '20px' }}>
                    <Typography><strong>Transaction ID:</strong> TXN-6751234567890</Typography>
                    <Typography><strong>Amount Paid:</strong> $125.00</Typography>
                    <Typography><strong>Date:</strong> October 28, 2024</Typography>
                  </Box>
                  
                  <Button
                    variant="outlined"
                    onClick={handleDownloadReceipt}
                    style={{ marginTop: '20px' }}
                  >
                    Download Receipt
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PaymentCenter;