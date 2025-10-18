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
  Button,
  TextField,
  Box
} from "@mui/material";
import LabStafNav from "../../Lab/Staff/LabStafNav";

const PharmacyInventory = () => {
  const [inventory, setInventory] = useState([
    {
      medication: "Amoxicillin",
      strength: "500 mg",
      form: "Capsule",
      quantity: 150,
      expiryDate: "2025-12-31",
      availability: "Available"
    },
    {
      medication: "Metformin", 
      strength: "850 mg",
      form: "Tablet",
      quantity: 80,
      expiryDate: "2024-08-15",
      availability: "Partial Stock"
    },
    {
      medication: "Lisinopril",
      strength: "10 mg", 
      form: "Tablet",
      quantity: 0,
      expiryDate: "2026-03-01",
      availability: "Out of Stock"
    },
    {
      medication: "Atorvastatin",
      strength: "20 mg",
      form: "Tablet", 
      quantity: 200,
      expiryDate: "2025-06-20",
      availability: "Available"
    },
    {
      medication: "Albuterol",
      strength: "90 mcg/actuation",
      form: "Inhaler",
      quantity: 10,
      expiryDate: "2024-07-10",
      availability: "Partial Stock"
    },
    {
      medication: "Fluoxetine",
      strength: "20 mg",
      form: "Capsule",
      quantity: 90,
      expiryDate: "2025-11-05",
      availability: "Available"
    },
    {
      medication: "Levothyroxine",
      strength: "100 mcg",
      form: "Tablet",
      quantity: 0,
      expiryDate: "2024-09-22",
      availability: "Out of Stock"
    }
  ]);

  const [counselingNotes, setCounselingNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState(false);

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'Available': return 'success';
      case 'Partial Stock': return 'warning';
      case 'Out of Stock': return 'error';
      default: return 'default';
    }
  };

  const handleAddNewItem = () => {
    alert("Add new item functionality would be implemented here");
  };

  const handleSaveNotes = () => {
    if (counselingNotes.trim()) {
      setSavedNotes(true);
      setTimeout(() => setSavedNotes(false), 3000);
    }
  };

  const handleUploadInventory = () => {
    alert("Upload inventory functionality would be implemented here");
  };

  return (
    <div className="lab_page_container">
      <LabStafNav />
      <div className="lab_main_content">
        <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: '#333' }}>
          Pharmacy Inventory - Admin Dashboard
        </Typography>

        <Grid container spacing={3}>
          {/* Upload Section */}
          <Grid item xs={6}>
            <Card style={{ height: '250px' }}>
              <CardContent style={{ textAlign: 'center', paddingTop: '40px' }}>
                <Typography variant="h6" gutterBottom>
                  Upload Inventory Data
                </Typography>
                <Box style={{ margin: '20px 0' }}>
                  <Typography variant="body2" color="textSecondary">
                    Drag and drop your inventory file here, or click to browse
                  </Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  onClick={handleUploadInventory}
                  style={{ marginTop: '20px' }}
                >
                  Browse Files
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Counseling Notes */}
          <Grid item xs={6}>
            <Card style={{ height: '250px' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Counseling Notes
                </Typography>
                <TextField
                  multiline
                  rows={6}
                  fullWidth
                  placeholder="Enter counseling notes here..."
                  value={counselingNotes}
                  onChange={(e) => setCounselingNotes(e.target.value)}
                  variant="outlined"
                  style={{ marginBottom: '15px' }}
                />
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={handleSaveNotes}
                  style={{ backgroundColor: '#1976d2' }}
                >
                  Save Notes
                </Button>
                {savedNotes && (
                  <Typography variant="body2" style={{ color: 'green', marginTop: '10px', textAlign: 'center' }}>
                    Notes saved successfully!
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Inventory Table */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '30px 0 20px 0' }}>
          <Typography variant="h5" style={{ fontWeight: 'bold' }}>
            Pharmacy Inventory
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleAddNewItem}
            style={{ padding: '10px 20px' }}
          >
            Add New Item
          </Button>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead style={{ backgroundColor: '#f0f0f0' }}>
              <TableRow>
                <TableCell><strong>Medication</strong></TableCell>
                <TableCell><strong>Strength</strong></TableCell>
                <TableCell><strong>Form</strong></TableCell>
                <TableCell><strong>Quantity</strong></TableCell>
                <TableCell><strong>Expiry Date</strong></TableCell>
                <TableCell><strong>Availability</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.medication}</TableCell>
                  <TableCell>{item.strength}</TableCell>
                  <TableCell>{item.form}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.expiryDate}</TableCell>
                  <TableCell>
                    <Chip 
                      label={item.availability} 
                      color={getAvailabilityColor(item.availability)}
                      size="small"
                    />
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

export default PharmacyInventory;